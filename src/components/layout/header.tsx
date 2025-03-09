import React from "react";
import { Bell, User, LogOut, Settings, Search, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("login");
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "accountant":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مدير النظام";
      case "manager":
        return "مدير";
      case "accountant":
        return "محاسب";
      case "viewer":
        return "مستخدم عادي";
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm p-4 shadow-sm">
      <div className="flex items-center justify-between" dir="rtl">
        <div className="flex items-center gap-2">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=شركتك&backgroundColor=0891b2"
            alt="Logo"
            className="h-10 w-10 rounded-lg"
          />
          <h1 className="text-xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent hidden md:block">
            نظام إدارة الرواتب
          </h1>
        </div>

        <div className="hidden md:flex relative max-w-md w-full mx-8">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث..."
            className="pl-3 pr-9 bg-muted/40 border-muted focus-visible:bg-background"
          />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user && hasPermission("manage_settings") && (
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-muted"
              onClick={() => navigate("/settings/activity-logs")}
              title="سجل النشاطات"
            >
              <FileText className="h-5 w-5" />
            </Button>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full overflow-hidden border"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <Badge className={getRoleBadgeClass(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasPermission("manage_settings") && (
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                )}
                {hasPermission("manage_users") && (
                  <DropdownMenuItem onClick={() => navigate("/settings/users")}>
                    <User className="ml-2 h-4 w-4" />
                    <span>إدارة المستخدمين</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={handleLogout}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
