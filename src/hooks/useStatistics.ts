"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const useArticleStats = () => {
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPublished, setTotalPublished] = useState(0);
  const [totalDraft, setTotalDraft] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleStats = async () => {
      try {
        setLoading(true);

        const { count: totalCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true });
        setTotalArticles(totalCount || 0);

        const { count: publishedCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");
        setTotalPublished(publishedCount || 0);

        const { count: draftCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "draft");
        setTotalDraft(draftCount || 0);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { count: monthlyCount } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .gte("createdAt", startOfMonth);
        setMonthlyChange(monthlyCount || 0);

        setError(null);
      } catch (err) {
        console.error("Error fetching article stats:", err);
        setError("Gagal memuat statistik artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleStats();
  }, []);

  return {
    totalArticles,
    totalPublished,
    totalDraft,
    monthlyChange,
    loading,
    error,
  };
};

export const useAnnouncementStats = () => {
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [activeAnnouncements, setActiveAnnouncements] = useState(0);
  const [expiredAnnouncements, setExpiredAnnouncements] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncementStats = async () => {
      try {
        setLoading(true);

        const { count: totalCount } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true });
        setTotalAnnouncements(totalCount || 0);

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const { count: activeCount } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .lte("startDate", today)
          .gte("endDate", today);
        setActiveAnnouncements(activeCount || 0);

        const { count: expiredCount } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .lt("endDate", today);
        setExpiredAnnouncements(expiredCount || 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { count: monthlyCount } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .gte("createdAt", startOfMonth);
        setMonthlyChange(monthlyCount || 0);

        setError(null);
      } catch (err) {
        console.error("Error fetching announcement stats:", err);
        setError("Gagal memuat statistik pengumuman");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementStats();
  }, []);

  return {
    totalAnnouncements,
    activeAnnouncements,
    expiredAnnouncements,
    monthlyChange,
    loading,
    error,
  };
};

export const useVisitorStats = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [dailyVisitors, setDailyVisitors] = useState(0);
  const [todayChange, setTodayChange] = useState(0);
  const [pageViews, setPageViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndUpdateVisitorStats = async () => {
      try {
        setLoading(true);

        const { getVisitorStats, updateVisitorStats, getTodayVisitorCount, cleanupOldVisitorData, ensureHistoricalData } = await import("@/lib/visitorService");

        await updateVisitorStats();

        await ensureHistoricalData(30);

        const stats = await getVisitorStats();

        if (stats) {
          setTotalVisitors(stats.totalVisitors);
          setPageViews(stats.pageViews);

          const todayCount = getTodayVisitorCount(stats);
          setDailyVisitors(todayCount);
          setTodayChange(todayCount);

          const lastCleanup = localStorage.getItem("lastCleanupDate");
          const today = new Date().toISOString().split("T")[0];
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (!lastCleanup || new Date(lastCleanup) < oneWeekAgo) {
            await cleanupOldVisitorData();
            localStorage.setItem("lastCleanupDate", today);
          }
        } else {
          setTotalVisitors(0);
          setDailyVisitors(0);
          setTodayChange(0);
          setPageViews(0);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching visitor stats:", err);
        setError("Gagal memuat statistik pengunjung");

        setTotalVisitors(0);
        setDailyVisitors(0);
        setTodayChange(0);
        setPageViews(0);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchAndUpdateVisitorStats, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    totalVisitors,
    dailyVisitors,
    todayChange,
    pageViews,
    loading,
    error,
  };
};

export const useDashboardStats = () => {
  const articleStats = useArticleStats();
  const announcementStats = useAnnouncementStats();
  const visitorStats = useVisitorStats();

  return {
    articles: articleStats,
    announcements: announcementStats,
    visitors: visitorStats,
    loading: articleStats.loading || announcementStats.loading || visitorStats.loading,
  };
};

