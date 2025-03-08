import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown, FileText, FileSpreadsheet, FileType } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";

interface DataExportProps {
  data: any[];
  filename?: string;
  onExport?: (format: "pdf" | "excel" | "csv") => void;
}

export function DataExport({
  data,
  filename = "export",
  onExport,
}: DataExportProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    setLoading(true);
    try {
      if (onExport) {
        onExport(format);
        setLoading(false);
        return;
      }

      if (format === "csv") {
        exportToCsv(data, filename);
      } else if (format === "excel") {
        exportToExcel(data, filename);
      } else if (format === "pdf") {
        exportToPdf(data, filename);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("حدث خطأ أثناء تصدير البيانات");
    } finally {
      setLoading(false);
    }
  };

  const exportToCsv = (data: any[], filename: string) => {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        return `"${value}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
  };

  const exportToExcel = (data: any[], filename: string) => {
    // In a real app, you would use a library like xlsx or exceljs
    // For this demo, we'll just export as CSV
    console.log("Exporting to Excel format", data);
    exportToCsv(data, filename);
  };

  const exportToPdf = (data: any[], filename: string) => {
    // In a real app, you would use a library like jspdf or pdfmake
    console.log("Exporting to PDF format", data);
    alert("PDF export would be implemented with a library like jsPDF");
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" className="ml-2" />
          ) : (
            <FileDown className="ml-2 h-4 w-4" />
          )}
          تصدير البيانات
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="ml-2 h-4 w-4" />
          تصدير كملف PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="ml-2 h-4 w-4" />
          تصدير كملف Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileType className="ml-2 h-4 w-4" />
          تصدير كملف CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
