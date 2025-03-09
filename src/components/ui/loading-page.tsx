import React from "react";
import { LoadingSpinner } from "./loading-spinner";

export function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">جاري التحميل...</p>
      </div>
    </div>
  );
}
