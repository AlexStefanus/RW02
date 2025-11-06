import { useArticleStats, useAnnouncementStats, useVisitorStats } from "./useStatisticsRefactored";

export const useDashboardStats = () => {
  const articleStats = useArticleStats();
  const announcementStats = useAnnouncementStats();
  const visitorStats = useVisitorStats();

  const loading = articleStats.loading || announcementStats.loading || visitorStats.loading;
  const hasError = articleStats.error || announcementStats.error || visitorStats.error;

  return {
    articles: {
      total: articleStats.totalArticles,
      published: articleStats.totalPublished,
      draft: articleStats.totalDraft,
      monthlyChange: articleStats.monthlyChange,
    },
    announcements: {
      total: announcementStats.totalAnnouncements,
      active: announcementStats.activeAnnouncements,
      expired: announcementStats.expiredAnnouncements,
      monthlyChange: announcementStats.monthlyChange,
    },
    visitors: {
      total: visitorStats.totalVisitors,
      today: visitorStats.todayVisitors,
      monthly: visitorStats.monthlyVisitors,
    },
    loading,
    error: hasError,
  };
};
