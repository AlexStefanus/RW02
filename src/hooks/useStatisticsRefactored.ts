import { useState, useEffect } from "react";
import { fetchArticleStats, fetchAnnouncementStats, fetchVisitorStats } from "@/services/statisticsService";

export const useArticleStats = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalPublished: 0,
    totalDraft: 0,
    monthlyChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const articleStats = await fetchArticleStats();
        setStats(articleStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching article stats:", err);
        setError("Gagal memuat statistik artikel");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { ...stats, loading, error };
};

export const useAnnouncementStats = () => {
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    expiredAnnouncements: 0,
    monthlyChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const announcementStats = await fetchAnnouncementStats();
        setStats(announcementStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching announcement stats:", err);
        setError("Gagal memuat statistik pengumuman");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { ...stats, loading, error };
};

export const useVisitorStats = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    monthlyVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const { ensureHistoricalData } = await import("@/lib/visitorService");
        await ensureHistoricalData(30);

        const visitorStats = await fetchVisitorStats();
        setStats(visitorStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching visitor stats:", err);
        setError("Gagal memuat statistik pengunjung");

        setStats({
          totalVisitors: 0,
          todayVisitors: 0,
          monthlyVisitors: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { ...stats, loading, error };
};

