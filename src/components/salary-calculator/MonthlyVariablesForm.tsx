import React, { useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z.object({
  month: z.date(),
  incentives: z.string().default("0"),
  bonuses: z.string().default("0"),
  absences: z.string().default("0"),
  penalties: z.string().default("0"),
  advances: z.string().default("0"),
  purchases: z.string().default("0"),
  delays: z.string().default("0"),
  monthlyBonus: z.string().default("0"),
});

type MonthlyVariablesFormProps = {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
  onValuesChange?: (values: z.infer<typeof formSchema>) => void;
};

export default function MonthlyVariablesForm({
  onSubmit = (values) => console.log(values),
  initialValues,
  onValuesChange,
}: MonthlyVariablesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      month: new Date(),
      incentives: "0",
      bonuses: "0",
      absences: "0",
      penalties: "0",
      advances: "0",
      purchases: "0",
      delays: "0",
      monthlyBonus: "0",
      ...initialValues,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onValuesChange?.(value as z.infer<typeof formSchema>);
    });
    return () => subscription.unsubscribe();
  }, [form, onValuesChange]);

  return (
    <Card className="w-full p-6 bg-card/80 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-6 text-right">
        المتغيرات الشهرية
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-end mb-6">
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={"w-[240px] pl-3 text-right"}
                        >
                          {field.value ? (
                            format(field.value, "MMMM yyyy", { locale: ar })
                          ) : (
                            <span>اختر الشهر</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="monthlyBonus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">
                    الحوافز الشهرية
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incentives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">الحوافز</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">التأخير</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
                    <Input
                      type="number"
                      {...field}
                      className="text-right"
                      placeholder="0"
                    />
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
              onClick={() => form.reset()}
            >
              إعادة تعيين
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
