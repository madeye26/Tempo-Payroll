import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-md text-sm ${className}`}
    >
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
