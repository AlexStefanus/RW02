import { useEffect, useState } from "react";
import { useActiveAnnouncements } from "@/hooks/useAnnouncements";
import { usePublishedArticles } from "@/hooks/useArticles";
import { LoadingSpinner, EmptyState } from "@/component/common/LoadingStates";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const RecentActivity = () => {
  const [mounted, setMounted] = useState(false);
  const { announcements, loading: announcementsLoading } = useActiveAnnouncements(2);
  const { articles, loading: articlesLoading } = usePublishedArticles(2);

  const getRecentActivities = () => {
    const activities: Array<{
      id: string;
      description: string;
      time: string;
      type: "announcement" | "article";
      createdAt: Date;
    }> = [];

    announcements.forEach((announcement) => {
      try {
        const date = announcement.createdAt && typeof announcement.createdAt === 'object' && 'toDate' in announcement.createdAt ? (announcement.createdAt as any).toDate() : new Date(announcement.createdAt || Date.now());
        activities.push({
          id: announcement.id,
          description: `Pengumuman baru "${announcement.title}" telah diupload`,
          time: format(date, "dd MMM yyyy", { locale: idLocale }),
          type: "announcement",
          createdAt: date,
        });
      } catch (error) {
      }
    });

    articles.forEach((article) => {
      if (!article.id) return;

      try {
        const date = article.createdAt && typeof article.createdAt === 'object' && 'toDate' in article.createdAt ? (article.createdAt as any).toDate() : new Date(article.createdAt || Date.now());
        activities.push({
          id: article.id,
          description: `Artikel baru "${article.title}" telah dipublikasi`,
          time: format(date, "dd MMM yyyy", { locale: idLocale }),
          type: "article",
          createdAt: date,
        });
      } catch (error) {
      }
    });

    return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 3);
  };

  const activities = getRecentActivities();
  const isLoading = announcementsLoading || articlesLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 smooth-transition hover-lift ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2 sm:gap-0">
        <h3 className="text-lg font-semibold text-gray-900 smooth-transition">Aktivitas Terbaru</h3>
        <button className="text-[#00a753] text-xs hover:underline self-start sm:self-auto smooth-transition hover:text-[#008c45]">Lihat Semua</button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Memuat aktivitas..." />
      ) : activities.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" description="Aktivitas terbaru akan muncul di sini" className="!py-8" />
      ) : (
        <div className="space-y-0">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`
                flex flex-col py-3 
                border-b border-gray-100 last:border-b-0 gap-1
                smooth-transition hover:bg-gray-50 px-2 -mx-2 rounded-md
                ${mounted ? `smooth-reveal stagger-${index + 1}` : "animate-on-load"}
              `}
            >
              <p className="text-gray-900 text-sm leading-relaxed smooth-transition">{activity.description}</p>
              <p className="text-gray-500 text-xs smooth-transition">{activity.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;

