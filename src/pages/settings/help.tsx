import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block">
        المساعدة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            الأسئلة الشائعة
          </h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>كيف يمكنني إضافة موظف جديد؟</AccordionTrigger>
              <AccordionContent>
                يمكنك إضافة موظف جديد من خلال الذهاب إلى صفحة "إدارة الموظفين"
                والنقر على زر "إضافة موظف جديد". قم بملء البيانات المطلوبة ثم
                انقر على زر "إضافة".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>كيف يمكنني حساب راتب موظف؟</AccordionTrigger>
              <AccordionContent>
                يمكنك حساب راتب موظف من خلال الذهاب إلى صفحة "كشوف المرتبات"
                واختيار الموظف من القائمة المنسدلة. قم بإدخال المتغيرات الشهرية
                مثل الحوافز والمكافآت والغياب والجزاءات، ثم انقر على زر "حساب
                الراتب".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>كيف يمكنني إضافة سلفة لموظف؟</AccordionTrigger>
              <AccordionContent>
                يمكنك إضافة سلفة لموظف من خلال الذهاب إلى صفحة "إدارة السلف"
                وملء نموذج إضافة سلفة جديدة. اختر الموظف وأدخل مبلغ السلفة
                وتاريخ السداد المتوقع، ثم انقر على زر "إضافة السلفة".
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                كيف يمكنني تسجيل حضور وانصراف الموظفين؟
              </AccordionTrigger>
              <AccordionContent>
                يمكنك تسجيل حضور وانصراف الموظفين من خلال الذهاب إلى صفحة
                "الإجازات والغياب" ثم اختيار تبويب "سجل الحضور". انقر على زر
                "تسجيل حضور جديد" واختر الموظف وأدخل البيانات المطلوبة.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                كيف يمكنني إنشاء تقرير للرواتب؟
              </AccordionTrigger>
              <AccordionContent>
                يمكنك إنشاء تقرير للرواتب من خلال الذهاب إلى صفحة "التقارير"
                واختيار الشهر والسنة المطلوبين، ثم النقر على زر "إنشاء التقرير".
                يمكنك بعد ذلك طباعة التقرير أو تصديره.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                كيف يمكنني إدارة صلاحيات المستخدمين؟
              </AccordionTrigger>
              <AccordionContent>
                يمكنك إدارة صلاحيات المستخدمين من خلال الذهاب إلى "الإعدادات" ثم
                "إدارة المستخدمين". يمكنك إضافة مستخدمين جدد أو تعديل صلاحيات
                المستخدمين الحاليين من خلال تغيير دورهم في النظام.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            دليل الاستخدام
          </h2>

          <p className="text-muted-foreground mb-4">
            يمكنك الاطلاع على دليل استخدام النظام الكامل للحصول على شرح مفصل
            لجميع وظائف النظام.
          </p>

          <Button
            className="w-full"
            onClick={() => window.open("/deployment-guide.md", "_blank")}
          >
            <FileText className="ml-2 h-4 w-4" />
            عرض دليل الاستخدام
          </Button>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">روابط مفيدة</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  فيديو تعليمي للنظام
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  التواصل مع الدعم الفني
                </a>
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
