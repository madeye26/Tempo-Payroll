import React, { useState } from "react";
import { Button } from "./button";
import { LoadingSpinner } from "./loading-spinner";
import { FileDown } from "lucide-react";
import { useToast } from "./use-toast";

interface DataExportProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
}

export function DataExport({
  data,
  filename = "export",
  disabled = false,
}: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    if (!data || data.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد بيانات للتصدير",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      // Convert to JSON string
      const jsonString = JSON.stringify(data, null, 2);

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير البيانات بنجاح",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "خطأ",
        description: `حدث خطأ أثناء تصدير البيانات: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={disabled || isExporting}
    >
      {isExporting ? (
        <>
          <LoadingSpinner size="sm" className="ml-2" />
          جاري التصدير...
        </>
      ) : (
        <>
          <FileDown className="ml-2 h-4 w-4" />
          تصدير
        </>
      )}
    </Button>
  );
}
