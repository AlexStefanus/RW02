"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import DashboardCard from "@/component/dashboard/DashboardCard";
import RecentActivity from "@/component/dashboard/RecentActivity";
import VisitorChart from "@/component/dashboard/VisitorChart";
import StorageIndicator from "@/component/dashboard/StorageIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useStatistics";
import { useUserStats } from "@/hooks/useUsers";
import VisitorStatsCard from "@/component/dashboard/VisitorStatsCard";
import { FiBell, FiFileText, FiUsers, FiClock, FiGithub, FiExternalLink, FiGlobe, FiServer, FiDatabase } from "react-icons/fi";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const { profile, user, loading } = useAuth();
  const { articles, announcements, visitors, loading: statsLoading } = useDashboardStats();
  const { stats: userStats, loading: userStatsLoading } = useUserStats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a753] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Dashboard"
        subtitle="Selamat datang di panel admin RW 02 Rangkah"
        mounted={mounted}
        actions={
          <div className="text-left sm:text-right sm:min-w-0 sm:flex-shrink-0">
            <p className="text-gray-600 text-xs truncate smooth-transition">Selamat datang, {profile.name || "Admin"}</p>
            <p className="text-gray-400 text-xs truncate smooth-transition">
              {profile.role === "admin" ? "Administrator" : "User"} • {profile.email}
            </p>
            <p className="text-gray-400 text-xs truncate smooth-transition">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        }
      />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2 space-y-6">
            <VisitorStatsCard />
            <VisitorChart type="line" timeRange="7days" />
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambahkan Informasi Baru</h3>
              <div className="space-y-3">
                <button
                  onClick={() => (window.location.href = "/dashboard/article/create")}
                  className="w-full bg-[#00a753] text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#008c45] transition-colors flex items-center justify-center gap-2"
                >
                  <FiFileText />
                  Buat Berita Baru
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard/announcement/create")}
                  className="w-full border border-[#00a753] text-[#00a753] py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#00a753] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FiBell />
                  Buat Pengumuman
                </button>
                <button
                  onClick={() => (window.location.href = "/dashboard/structure/create")}
                  className="w-full border border-[#00a753] text-[#00a753] py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-[#00a753] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FiUsers />
                  Tambah Struktur
                </button>
              </div>
            </div>
            <RecentActivity />

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">Berita Draft</span>
                  <span className="text-sm font-semibold text-gray-900">{articles.totalDraft}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">Berita Published</span>
                  <span className="text-sm font-semibold text-gray-900">{articles.totalPublished}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">Pengumuman Aktif</span>
                  <span className="text-sm font-semibold text-gray-900">{announcements.activeAnnouncements}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Pengumuman Expired</span>
                  <span className="text-sm font-semibold text-gray-900">{announcements.expiredAnnouncements}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition mt-8 ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <img
                src="/logo.png"
                alt="Logo MMD"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-upn.png"
                alt="Logo UB"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-blu.png"
                alt="Logo FILKOM"
                className="w-8 h-8 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-diktisaintek.png"
                alt="Logo Diktisaintek Berdampak"
                className="w-auto h-6 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <img
                src="/logo-kkn.png"
                alt="Logo Serangkah Melangkah"
                className="w-auto h-18 object-contain smooth-transition hover:scale-110 flex-shrink-0"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-black font-medium text-[10px] md:text-[10px] mb-[2px] smooth-transition">Dikembangkan oleh KKN Kelompok 03 Kelurahan Rangkah</p>
              <p className="text-black/70 text-[10px] md:text-[10px] leading-relaxed smooth-transition">Kuliah Kerja Nyata SDGs Periode II Universitas Pembangunan Nasional "Veteran" Jawa Timur 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
