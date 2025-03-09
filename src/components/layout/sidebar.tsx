import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  Calculator,
  CreditCard,
  Calendar,
  FileText,
  Settings,
  Home,
  Menu,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={href} className="block">
            <Button
              variant={active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-right my-1 transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted",
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-md",
                  active ? "bg-primary-foreground/20" : "bg-muted",
                )}
              >
                {icon}
              </div>
              <span className="font-medium">{label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left" className="mr-2">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<string>("/");
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  const routes = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "الرئيسية",
      href: "/",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "إدارة الموظفين",
      href: "/employees",
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: "كشوف المرتبات",
      href: "/salaries",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "إدارة السلف",
      href: "/advances",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "الإجازات والغياب",
      href: "/attendance",
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: "التقارير",
      href: "/reports",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "الإعدادات",
      href: "/settings",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "النسخ الاحتياطي",
      href: "/settings/backup",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "اختبار الاتصال",
      href: "/test-connection",
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="mb-8 px-4 flex items-center justify-center">
          <img
            src="https://api.dicebear.com/7.x/initials/svg?seed=شركتك&backgroundColor=0891b2"
            alt="Logo"
            className="h-12 w-12 rounded-xl shadow-md"
          />
        </div>
        <nav className="space-y-1 px-2">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              icon={route.icon}
              label={route.label}
              href={route.href}
              active={
                activeTab === route.href ||
                activeTab.startsWith(route.href + "/")
              }
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-right"
        >
          <div className="p-1.5 rounded-md bg-muted">
            <HelpCircle className="h-5 w-5" />
          </div>
          <span className="font-medium">المساعدة</span>
        </Button>
        <div className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} شركتك
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="h-full border-l bg-card/80 backdrop-blur-sm p-4 shadow-sm hidden md:block"
        dir="rtl"
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72" dir="rtl">
            <div className="h-full py-4">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
