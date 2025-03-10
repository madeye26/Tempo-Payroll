import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { testAppFunctionality } from "@/lib/test-app-functionality";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Check, X, RefreshCw } from "lucide-react";

export default function SystemTestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const runTests = async () => {
    setLoading(true);
    setStartTime(new Date());
    setEndTime(null);

    try {
      const testResults = await testAppFunctionality();
      setResults(testResults);
    } catch (error) {
      console.error("Error running tests:", error);
      setResults({
        error: true,
        message: `Error running tests: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
      setEndTime(new Date());
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge className="bg-green-100 text-green-800">
        <Check className="h-3 w-3 mr-1" /> ناجح
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <X className="h-3 w-3 mr-1" /> فشل
      </Badge>
    );
  };

  const allTestsPassed =
    results && Object.values(results).every((result: any) => result.success);

  return (
    <div className="space-y-6" dir="rtl">
      <PageHeader
        title="اختبار النظام"
        description="التحقق من جاهزية النظام للنشر"
        actions={
          <Button onClick={runTests} disabled={loading}>
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة الاختبار
          </Button>
        }
      />

      {loading ? (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg">جاري اختبار النظام...</p>
          </div>
        </Card>
      ) : results ? (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">نتائج الاختبار</h2>
              <Badge
                className={
                  allTestsPassed
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {allTestsPassed
                  ? "جميع الاختبارات ناجحة"
                  : "بعض الاختبارات فشلت"}
              </Badge>
            </div>

            {startTime && endTime && (
              <div className="mb-4 text-sm text-muted-foreground">
                <p>وقت بدء الاختبار: {startTime.toLocaleTimeString("ar-EG")}</p>
                <p>
                  وقت انتهاء الاختبار: {endTime.toLocaleTimeString("ar-EG")}
                </p>
                <p>
                  مدة الاختبار:{" "}
                  {((endTime.getTime() - startTime.getTime()) / 1000).toFixed(
                    2,
                  )}{" "}
                  ثانية
                </p>
              </div>
            )}

            <div className="space-y-4">
              {results.error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-800">{results.message}</p>
                </div>
              ) : (
                Object.entries(results).map(([key, value]: [string, any]) => (
                  <div key={key} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {key === "database" && "قاعدة البيانات"}
                        {key === "auth" && "نظام المصادقة"}
                        {key === "employees" && "نظام الموظفين"}
                        {key === "salaries" && "نظام الرواتب"}
                        {key === "activityLogs" && "سجل النشاطات"}
                        {key === "advances" && "نظام السلف"}
                        {key === "attendance" && "نظام الحضور والإجازات"}
                        {key === "reports" && "نظام التقارير"}
                        {key === "backup" && "نظام النسخ الاحتياطي"}
                      </h3>
                      {getStatusBadge(value.success)}
                    </div>
                    <p className="text-sm">{value.message}</p>
                    {value.details && Object.keys(value.details).length > 0 && (
                      <div className="mt-2 text-xs bg-muted/50 p-2 rounded">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(value.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">توصيات النشر</h2>
            {allTestsPassed ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-800">
                <p className="font-semibold">النظام جاهز للنشر! ✅</p>
                <p className="mt-2">
                  جميع الاختبارات ناجحة ويمكن المتابعة بعملية النشر.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                <p className="font-semibold">
                  هناك بعض المشاكل التي يجب معالجتها قبل النشر ⚠️
                </p>
                <p className="mt-2">
                  يرجى مراجعة نتائج الاختبار أعلاه ومعالجة المشاكل قبل المتابعة.
                </p>
                <ul className="list-disc list-inside mt-2">
                  {Object.entries(results).map(
                    ([key, value]: [string, any]) => {
                      if (!value.success) {
                        return (
                          <li key={key}>
                            <span className="font-medium">
                              {key === "database" && "قاعدة البيانات"}
                              {key === "auth" && "نظام المصادقة"}
                              {key === "employees" && "نظام الموظفين"}
                              {key === "salaries" && "نظام الرواتب"}
                              {key === "activityLogs" && "سجل النشاطات"}
                              {key === "advances" && "نظام السلف"}
                              {key === "attendance" && "نظام الحضور والإجازات"}
                              {key === "reports" && "نظام التقارير"}
                              {key === "backup" && "نظام النسخ الاحتياطي"}
                            </span>
                            : {value.message}
                          </li>
                        );
                      }
                      return null;
                    },
                  )}
                </ul>
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
