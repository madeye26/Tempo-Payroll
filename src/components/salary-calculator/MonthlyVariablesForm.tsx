import React from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  incentives: z.string().default("0"),
  bonuses: z.string().default("0"),
  absences: z.string().default("0"),
  penalties: z.string().default("0"),
  advances: z.string().default("0"),
  purchases: z.string().default("0"),
});

type MonthlyVariablesFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialValues?: z.infer<typeof formSchema>;
};

export default function MonthlyVariablesForm({
  onSubmit = (values) => console.log(values),
  initialValues = {
    incentives: "0",
    bonuses: "0",
    absences: "0",
    penalties: "0",
    advances: "0",
    purchases: "0",
  },
}: MonthlyVariablesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <Card className="w-full p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-right">
        المتغيرات الشهرية
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="incentives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">الحوافز</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bonuses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">المكافآت</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="absences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">الغياب</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="penalties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">الجزاءات</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">السلف</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">المشتريات</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="submit" className="w-32">
              حفظ
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => form.reset(initialValues)}
            >
              إعادة تعيين
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
