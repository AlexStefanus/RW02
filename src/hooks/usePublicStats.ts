"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const usePublicStats = () => {
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const [activeAnnouncements, setActiveAnnouncements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        setLoading(true);

        const { count: articlesCount, error: articlesError } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("status", "published");

        if (articlesError) throw articlesError;
        setTotalArticles(articlesCount || 0);

        const { count: announcementsCount, error: announcementsError } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true });

        if (announcementsError) throw announcementsError;
        setTotalAnnouncements(announcementsCount || 0);

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const { count: activeCount, error: activeError } = await supabase
          .from("announcements")
          .select("*", { count: "exact", head: true })
          .lte("startDate", today)
          .gte("endDate", today);

        if (activeError) throw activeError;
        setActiveAnnouncements(activeCount || 0);

        setError(null);
      } catch (err) {
        console.error("Error fetching public stats:", err);
        setError("Gagal memuat statistik");
        setTotalArticles(156);
        setTotalAnnouncements(42);
        setActiveAnnouncements(8);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStats();
  }, []);

  return {
    totalArticles,
    totalAnnouncements,
    activeAnnouncements,
    loading,
    error,
  };
};

