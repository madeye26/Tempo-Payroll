import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend = "neutral",
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-md",
        className,
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trendValue && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
              ) : (
                <Minus className="h-4 w-4 text-gray-500 ml-1" />
              )}
              <span
                className={cn(
                  "text-xs",
                  trend === "up"
                    ? "text-green-500"
                    : trend === "down"
                      ? "text-red-500"
                      : "text-gray-500",
                )}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>
    </Card>
  );
}
