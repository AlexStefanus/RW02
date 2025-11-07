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
import { FiBell, FiFileText, FiUsers, FiClock, FiCalendar, FiTrendingUp, FiEye, FiImage } from "react-icons/fi";

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
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Visitors Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiEye size={24} />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Hari Ini</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{visitors.dailyVisitors}</h3>
            <p className="text-blue-100 text-sm">Pengunjung</p>
          </div>

          {/* Articles Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiFileText size={24} />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{articles.totalPublished}</h3>
            <p className="text-green-100 text-sm">Berita Published</p>
          </div>

          {/* Announcements Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiBell size={24} />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Aktif</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{announcements.activeAnnouncements}</h3>
            <p className="text-purple-100 text-sm">Pengumuman</p>
          </div>

          {/* Page Views Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <FiTrendingUp size={24} />
              </div>
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{visitors.pageViews}</h3>
            <p className="text-orange-100 text-sm">Page Views</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-6">
            <VisitorStatsCard />
            <VisitorChart type="line" timeRange="7days" />
          </div>

          {/* Right Column - Summary */}
          <div className="xl:col-span-1 space-y-6">
            {/* Recent Activity */}
            <RecentActivity />

            {/* Summary Stats */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#00a753] rounded-full"></span>
                Ringkasan Konten
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiFileText className="text-gray-400" size={16} />
                    Berita Draft
                  </span>
                  <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{articles.totalDraft}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiFileText className="text-green-500" size={16} />
                    Berita Published
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{articles.totalPublished}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiBell className="text-purple-500" size={16} />
                    Pengumuman Aktif
                  </span>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{announcements.activeAnnouncements}</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <FiClock className="text-gray-400" size={16} />
                    Pengumuman Expired
                  </span>
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{announcements.expiredAnnouncements}</span>
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
