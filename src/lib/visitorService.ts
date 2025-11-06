import { supabase } from "./supabase";

export interface VisitorStats {
  totalVisitors: number;
  dailyVisits: Record<string, number>;
  lastUpdated: string;
  uniqueVisitors: number;
  pageViews: number;
}

const VISITOR_STATS_ID = "stats";

const getConsistentDate = (): string => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};

const isStorageAvailable = (type: "localStorage" | "sessionStorage"): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const getVisitorStats = async (): Promise<VisitorStats | null> => {
  try {
    const { data, error } = await supabase
      .from("visitors")
      .select("*")
      .eq("id", VISITOR_STATS_ID)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (data) {
      return data as VisitorStats;
    }

    // Initialize default stats
    const today = new Date();
    const initialDailyVisits: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      initialDailyVisits[dateStr] = 0;
    }

    const defaultStats: VisitorStats = {
      totalVisitors: 0,
      dailyVisits: initialDailyVisits,
      lastUpdated: new Date().toISOString(),
      uniqueVisitors: 0,
      pageViews: 0,
    };

    const { error: insertError } = await supabase
      .from("visitors")
      .insert([{ id: VISITOR_STATS_ID, ...defaultStats }]);

    if (insertError) throw insertError;

    return defaultStats;
  } catch (error) {
    console.error("Error getting visitor stats:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
};

export const updateVisitorStats = async (): Promise<void> => {
  try {
    if (typeof window === "undefined") {
      return;
    }

    const today = getConsistentDate();
    const hasLocalStorage = isStorageAvailable("localStorage");
    const hasSessionStorage = isStorageAvailable("sessionStorage");

    let lastVisitDate = "";
    let sessionVisitDate = "";
    let lastFingerprint = "";

    if (hasLocalStorage) {
      lastVisitDate = localStorage.getItem("lastVisitDate") || "";
      lastFingerprint = localStorage.getItem("userFingerprint") || "";
    }

    if (hasSessionStorage) {
      sessionVisitDate = sessionStorage.getItem("sessionVisitDate") || "";
    }

    const userFingerprint = generateUserFingerprint();
    const isNewVisitor = lastVisitDate !== today || sessionVisitDate !== today || (lastFingerprint && lastFingerprint !== userFingerprint);

    const stats = await getVisitorStats();
    if (!stats) return;

    const updatedDailyVisits = { ...stats.dailyVisits };
    if (isNewVisitor) {
      updatedDailyVisits[today] = (updatedDailyVisits[today] || 0) + 1;
    }

    const { error } = await supabase
      .from("visitors")
      .update({
        totalVisitors: isNewVisitor ? stats.totalVisitors + 1 : stats.totalVisitors,
        dailyVisits: updatedDailyVisits,
        lastUpdated: new Date().toISOString(),
        uniqueVisitors: isNewVisitor ? stats.uniqueVisitors + 1 : stats.uniqueVisitors,
        pageViews: stats.pageViews + 1,
      })
      .eq("id", VISITOR_STATS_ID);

    if (error) throw error;

    if (isNewVisitor) {
      if (hasLocalStorage) {
        localStorage.setItem("lastVisitDate", today);
        localStorage.setItem("userFingerprint", userFingerprint);
      }

      if (hasSessionStorage) {
        sessionStorage.setItem("sessionVisitDate", today);
      }
    }
  } catch (error) {
    console.error("Error updating visitor stats:", error);
  }
};

const generateUserFingerprint = (): string => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return navigator.userAgent.slice(0, 10) + Date.now().toString(36);
    }

    ctx.textBaseline = "top";
    ctx.font = "14px Arial";
    ctx.fillText("Browser fingerprint", 2, 2);

    const fingerprint = [navigator.userAgent, navigator.language, screen.width + "x" + screen.height, new Date().getTimezoneOffset().toString(), canvas.toDataURL()].join("|");

    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(36);
  } catch (error) {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
};

export const cleanupOldVisitorData = async (): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const updatedDailyVisits: Record<string, number> = {};

    Object.entries(stats.dailyVisits).forEach(([date, count]) => {
      if (new Date(date) >= oneYearAgo) {
        updatedDailyVisits[date] = count;
      }
    });

    if (Object.keys(updatedDailyVisits).length !== Object.keys(stats.dailyVisits).length) {
      const { error } = await supabase
        .from("visitors")
        .update({
          dailyVisits: updatedDailyVisits,
          lastUpdated: new Date().toISOString(),
        })
        .eq("id", VISITOR_STATS_ID);

      if (error) throw error;
    }
  } catch (error) {
    console.error("Error cleaning up visitor data:", error);
  }
};

export const getTodayVisitorCount = (stats: VisitorStats): number => {
  const today = getConsistentDate();
  return stats.dailyVisits[today] || 0;
};

export const getWeeklyVisitorCount = (stats: VisitorStats): number => {
  const today = new Date();
  let weeklyCount = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    weeklyCount += stats.dailyVisits[dateStr] || 0;
  }

  return weeklyCount;
};

export const ensureHistoricalData = async (days: number = 30): Promise<void> => {
  try {
    const stats = await getVisitorStats();
    if (!stats) return;

    const today = new Date();
    const updatedDailyVisits = { ...stats.dailyVisits };
    let hasNewData = false;

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      if (!(dateStr in updatedDailyVisits)) {
        updatedDailyVisits[dateStr] = 0;
        hasNewData = true;
      }
    }

    if (hasNewData) {
      const { error } = await supabase
        .from("visitors")
        .update({
          dailyVisits: updatedDailyVisits,
          lastUpdated: new Date().toISOString(),
        })
        .eq("id", VISITOR_STATS_ID);

      if (error) throw error;
    }
  } catch (error) {
    console.error("Error ensuring historical data:", error);
  }
};

export const getVisitorDataByRange = (stats: VisitorStats, days: number): { labels: string[]; data: number[] } => {
  const today = new Date();
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    labels.push(dayName);
    data.push(stats.dailyVisits[dateStr] || 0);
  }

  return { labels, data };
};
