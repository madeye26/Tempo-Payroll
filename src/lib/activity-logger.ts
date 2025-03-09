import { supabase } from "./supabase";

type ActivityType =
  | "auth"
  | "employee"
  | "salary"
  | "advance"
  | "attendance"
  | "report"
  | "setting";
type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "view"
  | "login"
  | "logout"
  | "export";

export interface ActivityLog {
  id: string;
  user_id: string;
  type: ActivityType;
  action: ActivityAction;
  description: string;
  details?: any;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

/**
 * Log an activity in the system
 * @param type The type of activity
 * @param action The action performed
 * @param description A human-readable description of the activity
 * @param userId The ID of the user who performed the action
 * @param details Optional additional details about the activity
 */
export const logActivity = async (
  type: ActivityType,
  action: ActivityAction,
  description: string,
  userId: string,
  details?: any,
) => {
  try {
    const timestamp = new Date().toISOString();
    const activityData = {
      user_id: userId,
      type,
      action,
      description,
      details: details ? JSON.stringify(details) : null,
      created_at: timestamp,
    };

    // Always log to localStorage first for reliability
    const existingLogs = JSON.parse(
      localStorage.getItem("activity_logs") || "[]",
    );
    const newLog = {
      id: Date.now().toString(),
      ...activityData,
    };
    existingLogs.unshift(newLog); // Add to beginning of array
    localStorage.setItem("activity_logs", JSON.stringify(existingLogs));

    // Then try to log to Supabase if available
    if (supabase) {
      try {
        const { error } = await supabase.from("activity_logs").insert([
          {
            id: newLog.id,
            ...activityData,
          },
        ]);

        if (error) {
          console.error("Error logging activity to Supabase:", error);
          // Already saved to localStorage above
        } else {
          console.log("Activity logged to Supabase successfully");
        }
      } catch (supabaseError) {
        console.error("Supabase operation failed:", supabaseError);
        // Already saved to localStorage above
      }
    }

    // Force update any components that might be listening for activity logs
    const event = new CustomEvent("activity-logged", { detail: activityData });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

/**
 * Get activity logs with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param filters Optional filters for the logs
 */
export const getActivityLogs = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    userId?: string;
    type?: ActivityType;
    action?: ActivityAction;
    startDate?: string;
    endDate?: string;
  },
): Promise<{ logs: ActivityLog[]; total: number }> => {
  try {
    if (supabase) {
      try {
        let query = supabase
          .from("activity_logs")
          .select(
            `
            *,
            users:user_id (name, email)
          `,
            { count: "exact" },
          )
          .order("created_at", { ascending: false });

        // Apply filters
        if (filters?.userId) {
          query = query.eq("user_id", filters.userId);
        }
        if (filters?.type) {
          query = query.eq("type", filters.type);
        }
        if (filters?.action) {
          query = query.eq("action", filters.action);
        }
        if (filters?.startDate) {
          query = query.gte("created_at", filters.startDate);
        }
        if (filters?.endDate) {
          query = query.lte("created_at", filters.endDate);
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
          console.error("Supabase query error:", error);
          // Fall back to localStorage if Supabase query fails
          return getLogsFromLocalStorage();
        }

        // Format the logs with user information
        const formattedLogs = data.map((log) => ({
          ...log,
          user_name: log.users?.name || "غير معروف",
          user_email: log.users?.email || "غير معروف",
        }));

        return { logs: formattedLogs, total: count || 0 };
      } catch (supabaseError) {
        console.error("Supabase operation failed:", supabaseError);
        // Fall back to localStorage if Supabase operation fails
        return getLogsFromLocalStorage();
      }
    } else {
      return getLogsFromLocalStorage();
    }

    function getLogsFromLocalStorage() {
      // Get logs from localStorage
      const existingLogs = JSON.parse(
        localStorage.getItem("activity_logs") || "[]",
      );

      // Apply filters
      let filteredLogs = existingLogs;
      if (filters?.userId) {
        filteredLogs = filteredLogs.filter(
          (log: any) => log.user_id === filters.userId,
        );
      }
      if (filters?.type) {
        filteredLogs = filteredLogs.filter(
          (log: any) => log.type === filters.type,
        );
      }
      if (filters?.action) {
        filteredLogs = filteredLogs.filter(
          (log: any) => log.action === filters.action,
        );
      }
      if (filters?.startDate) {
        filteredLogs = filteredLogs.filter(
          (log: any) =>
            new Date(log.created_at) >= new Date(filters.startDate!),
        );
      }
      if (filters?.endDate) {
        filteredLogs = filteredLogs.filter(
          (log: any) => new Date(log.created_at) <= new Date(filters.endDate!),
        );
      }

      // Sort by created_at in descending order
      filteredLogs.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      // Apply pagination
      const total = filteredLogs.length;
      const from = (page - 1) * limit;
      const paginatedLogs = filteredLogs.slice(from, from + limit);

      // Get user information
      const mockUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const formattedLogs = paginatedLogs.map((log: any) => {
        const user = mockUsers.find((u: any) => u.id === log.user_id);
        return {
          ...log,
          user_name: user?.name || "غير معروف",
          user_email: user?.email || "غير معروف",
        };
      });

      return { logs: formattedLogs, total };
    }
  } catch (error) {
    console.error("Error getting activity logs:", error);
    return { logs: [], total: 0 };
  }
};
