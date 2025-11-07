"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ActivePageTitleProps {
  className?: string;
}

const ActivePageTitle = ({ className = "" }: ActivePageTitleProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    const pageMap: Record<string, { title: string; subtitle: string }> = {
      "/": { title: "Beranda", subtitle: "Selamat datang di website RW 02 Rangkah" },
      "/tentang": { title: "Tentang", subtitle: "Informasi mengenai RW 02 Rangkah" },
      "/berita": { title: "Berita", subtitle: "Berita terbaru dari RW 02 Rangkah" },
      "/pengumuman": { title: "Pengumuman", subtitle: "Pengumuman resmi dari RW 02 Rangkah" },
      "/struktur": { title: "Struktur", subtitle: "Struktur organisasi RW 02 Rangkah" },
      "/galeri": { title: "Galeri", subtitle: "Koleksi foto dan video kegiatan RW 02 Rangkah" },
      "/dashboard": { title: "Dashboard", subtitle: "Panel administrasi website" },
    };

    if (pathSegments.length > 1) {
      const baseRoute = `/${pathSegments[0]}`;
      const pageInfo = pageMap[baseRoute];
      if (pageInfo) {
        return {
          title: pageInfo.title,
          subtitle: `${pageInfo.subtitle} - Detail`,
        };
      }
    }

    return pageMap[pathname] || { title: "Halaman", subtitle: "RW 02 Rangkah" };
  };

  if (!mounted) return null;

  const { title, subtitle } = getPageTitle();

  return (
    <div className={`text-center py-8 bg-gradient-to-r from-[#00a753] to-[#2563eb] text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-3xl md:text-4xl font-bold mb-2 smooth-transition ${mounted ? "animate-slide-in-down" : "animate-on-load"}`}>{title}</h1>
        <p className={`text-lg text-blue-100 smooth-transition ${mounted ? "animate-slide-in-up" : "animate-on-load"}`}>{subtitle}</p>


        <div className="mt-4 flex justify-center">
          <div className="w-20 h-1 bg-white rounded-full animate-scale-in"></div>
        </div>
      </div>
    </div>
  );
};

export default ActivePageTitle;

