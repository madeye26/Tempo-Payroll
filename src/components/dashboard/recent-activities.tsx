import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Users, Calendar, FileText } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "salary" | "advance" | "attendance" | "employee";
  status: "success" | "pending" | "error";
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "salary":
        return <CreditCard className="h-5 w-5" />;
      case "employee":
        return <Users className="h-5 w-5" />;
      case "attendance":
        return <Calendar className="h-5 w-5" />;
      case "advance":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">تم</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">خطأ</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getActivityTypeClass = (type: string) => {
    switch (type) {
      case "salary":
        return "bg-blue-100 text-blue-800";
      case "employee":
        return "bg-purple-100 text-purple-800";
      case "attendance":
        return "bg-green-100 text-green-800";
      case "advance":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-right">آخر النشاطات</h3>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={`p-2 rounded-full flex-shrink-0 ${getActivityTypeClass(
                  activity.type,
                )}`}
              >
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{activity.title}</h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            لا توجد نشاطات حديثة
          </div>
        )}
      </div>
    </Card>
  );
}
