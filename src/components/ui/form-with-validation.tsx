import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";

interface FormWithValidationProps<T extends z.ZodType> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  submitText: string;
  loadingText?: string;
  successText?: string;
  fields: Array<{
    name: keyof z.infer<T> & string;
    label: string;
    type?: string;
    placeholder?: string;
    dir?: "rtl" | "ltr";
  }>;
  className?: string;
}

export function FormWithValidation<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  submitText,
  loadingText = "جاري الحفظ...",
  successText,
  fields,
  className = "",
}: FormWithValidationProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(values: z.infer<T>) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      await onSubmit(values);
      setIsSuccess(true);

      // Reset success state after 3 seconds
      if (successText) {
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "حدث خطأ غير متوقع",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`space-y-6 ${className}`}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    className="text-right"
                    dir={field.dir || "rtl"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 text-red-600 rounded-md text-sm"
          >
            {errorMessage}
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full transition-all duration-300 hover:shadow-md"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="ml-2" />
              {loadingText}
            </>
          ) : isSuccess && successText ? (
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              {successText}
            </motion.span>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </Form>
  );
}
