import React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { motion } from "framer-motion";

export function LoadingPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground animate-pulse">جاري التحميل...</p>
      </motion.div>
    </div>
  );
}
