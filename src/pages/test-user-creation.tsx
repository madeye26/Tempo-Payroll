import React from "react";
import { AuthDebug } from "@/components/auth/auth-debug";
import { DebugLogin } from "@/components/auth/debug-login";
import { PageHeader } from "@/components/ui/page-header";

export default function TestUserCreationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Supabase Auth Debug"
        description="Test and debug Supabase authentication"
      />
      <DebugLogin />
      <AuthDebug />
    </div>
  );
}
