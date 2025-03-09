import { supabase } from "./supabase";

/**
 * Synchronizes activity logs between localStorage and Supabase database
 * This helps ensure logs are preserved across different clients
 */
export async function syncActivityLogs() {
  if (!supabase) {
    console.log("Supabase not available, skipping activity log sync");
    return;
  }

  try {
    // Get logs from localStorage
    const localLogs = JSON.parse(localStorage.getItem("activity_logs") || "[]");
    if (localLogs.length === 0) {
      console.log("No local logs to sync");
      return;
    }

    console.log(`Syncing ${localLogs.length} local activity logs to Supabase`);

    // Prepare logs for Supabase format
    const logsToSync = localLogs.map((log) => ({
      user_id: log.user_id,
      type: log.type,
      action: log.action,
      description: log.description,
      details: log.details || null,
      created_at: log.created_at,
    }));

    // Insert logs into Supabase
    const { error } = await supabase.from("activity_logs").insert(logsToSync);

    if (error) {
      console.error("Error syncing activity logs to Supabase:", error);
    } else {
      console.log("Successfully synced activity logs to Supabase");
    }
  } catch (error) {
    console.error("Error in syncActivityLogs:", error);
  }
}

/**
 * Fetches activity logs from Supabase and merges them with local logs
 */
export async function fetchAndMergeActivityLogs() {
  if (!supabase) {
    console.log("Supabase not available, skipping activity log fetch");
    return;
  }

  try {
    console.log("Fetching activity logs from Supabase...");
    // Get logs from Supabase
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching activity logs from Supabase:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("No activity logs found in Supabase");
      return;
    }

    console.log(`Fetched ${data.length} activity logs from Supabase`);

    // Get local logs
    const localLogs = JSON.parse(localStorage.getItem("activity_logs") || "[]");

    // Create a map of existing log IDs for quick lookup
    const existingLogIds = new Set(localLogs.map((log) => log.id));

    // Convert Supabase logs to the format used in localStorage
    const supabaseLogs = data.map((log) => ({
      id: log.id,
      user_id: log.user_id,
      type: log.type,
      action: log.action,
      description: log.description,
      details: log.details,
      created_at: log.created_at,
    }));

    // Add only new logs from Supabase
    const newLogs = supabaseLogs.filter((log) => !existingLogIds.has(log.id));

    if (newLogs.length > 0) {
      // Merge and sort logs by created_at (newest first)
      const mergedLogs = [...newLogs, ...localLogs].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      // Update localStorage
      localStorage.setItem("activity_logs", JSON.stringify(mergedLogs));
      console.log(
        `Added ${newLogs.length} new logs from Supabase to localStorage`,
      );
    } else {
      console.log("No new logs to add from Supabase");
    }
  } catch (error) {
    console.error("Error in fetchAndMergeActivityLogs:", error);
  }
}
