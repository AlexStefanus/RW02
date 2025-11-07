import { supabase } from "@/lib/supabase";

export const fetchArticleStats = async () => {
  const { count: totalCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const { count: publishedCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: draftCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: monthlyCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .gte("createdAt", startOfMonth);

  return {
    totalArticles: totalCount || 0,
    totalPublished: publishedCount || 0,
    totalDraft: draftCount || 0,
    monthlyChange: monthlyCount || 0,
  };
};

export const fetchAnnouncementStats = async () => {
  const { count: totalCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true });

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const { count: activeCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })
    .lte("startDate", today)
    .gte("endDate", today);

  const { count: expiredCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })
    .lt("endDate", today);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: monthlyCount } = await supabase
    .from("announcements")
    .select("*", { count: "exact", head: true })
    .gte("createdAt", startOfMonth);

  return {
    totalAnnouncements: totalCount || 0,
    activeAnnouncements: activeCount || 0,
    expiredAnnouncements: expiredCount || 0,
    monthlyChange: monthlyCount || 0,
  };
};

export const fetchVisitorStats = async () => {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .eq("id", "stats")
    .single();

  if (error || !data) {
    return {
      totalVisitors: 0,
      todayVisitors: 0,
      monthlyVisitors: 0,
    };
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const todayCount = data.dailyVisits?.[today] || 0;

  let monthlyCount = 0;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let d = new Date(startOfMonth); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    monthlyCount += data.dailyVisits?.[dateStr] || 0;
  }

  return {
    totalVisitors: data.totalVisitors || 0,
    todayVisitors: todayCount,
    monthlyVisitors: monthlyCount,
  };
};
