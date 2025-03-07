import React from "react";
import { Bell, User, LogOut, Settings, Search } from "lucide-react";
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

export function Header() {
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

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full overflow-hidden border"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                    alt="@admin"
                  />
                  <AvatarFallback>مد</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">المدير</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="ml-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="ml-2 h-4 w-4" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                <LogOut className="ml-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
