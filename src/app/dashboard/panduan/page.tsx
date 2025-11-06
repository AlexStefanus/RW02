"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import { FiBookOpen, FiMaximize2, FiMinimize2, FiDatabase, FiServer, FiGlobe, FiGithub, FiExternalLink } from "react-icons/fi";

const PanduanPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Panduan Penggunaan"
        subtitle="Panduan lengkap penggunaan dan manajemen website RW 02 Rangkah"
        mounted={mounted}
        actions={
          <button onClick={toggleFullscreen} className="inline-flex items-center px-3 py-1.5 bg-[#00a753] text-white text-xs font-medium rounded-lg hover:bg-[#00a753]/90 smooth-transition hover:scale-105 active:scale-95">
            {isFullscreen ? <FiMinimize2 className="mr-1.5" size={12} /> : <FiMaximize2 className="mr-1.5" size={12} />}
            {isFullscreen ? "Kecilkan" : "Perbesar"}
          </button>
        }
      />

      <div className="flex-1 p-4 sm:p-6 bg-gray-50">
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden smooth-transition ${isFullscreen ? "fixed inset-4 z-50" : ""} ${mounted ? "smooth-reveal stagger-2" : "animate-on-load"}`}>
          {isFullscreen && (
            <div className="flex items-center justify-between p-4 bg-[#00a753] text-white">
              <div className="flex items-center">
                <FiBookOpen className="mr-2" size={16} />
                <h2 className="text-sm font-medium">Panduan Penggunaan Dashboard</h2>
              </div>
              <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg smooth-transition">
                <FiMinimize2 size={16} />
              </button>
            </div>
          )}

          <div className={`${isFullscreen ? "h-[calc(100vh-120px)]" : "w-full aspect-video"}`}>
            <iframe
              src="https://www.canva.com/design/DAGtxAYVlyw/06zU4PFWRGKyPSF3E37lpg/view?embed"
              title="Panduan Penggunaan Dashboard RW 02 Rangkah"
              className="w-full h-full border-0"
              allowFullScreen
              allow="camera; microphone; geolocation"
              loading="lazy"
            />
          </div>
        </div>

        <div className={`mt-6 smooth-transition ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Panduan Dashboard Eksternal</h2>
          <p className="text-xs text-gray-700 mb-4">Pastikan anda login menggunakan Akun Google kknrangkahupnvjt@gmail.com saat mengakses dashboard eksternal tersebut. Baca panduan di atas untuk informasi lebih lanjut.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiDatabase className="text-[#00a753]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#00a753] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Supabase Console</h3>
              <p className="text-sm text-gray-600 mb-3">Kelola database dan sistem autentikasi website ini.</p>
              <button
                onClick={() => window.open("https://supabase.com/dashboard/project/lientamlkzkxdvlnuukf", "_blank")}
                className="w-full bg-[#00a753] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#008c45] smooth-transition"
              >
                Buka Supabase
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiServer className="text-[#00a753]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#00a753] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Vercel Dashboard</h3>
              <p className="text-sm text-gray-600 mb-3">Monitor deployment dan performance dari website ini.</p>
              <button
                onClick={() => window.open("https://vercel.com/it-mmd-blu-49s-projects/website-desa-ngebruk", "_blank")}
                className="w-full bg-[#00a753] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#008c45] smooth-transition"
              >
                Buka Vercel
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiGlobe className="text-[#00a753]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#00a753] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">IDCloudHost</h3>
              <p className="text-sm text-gray-600 mb-3">Kelola domain rangkah02.site yang digunakan oleh web ini.</p>
              <button onClick={() => window.open("https://my.idcloudhost.com/clientarea.php", "_blank")} className="w-full bg-[#00a753] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#008c45] smooth-transition">
                Buka IDCloudHouse
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md smooth-transition hover-lift cursor-pointer group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 smooth-transition">
                  <FiGithub className="text-[#00a753]" size={20} />
                </div>
                <FiExternalLink className="text-gray-400 group-hover:text-[#00a753] smooth-transition" size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">GitHub Repository</h3>
              <p className="text-sm text-gray-600 mb-3">Akses dan modifikasi source code dari website ini.</p>
              <button
                onClick={() => window.open("https://github.com/it-mmd-blu-49/website-desa-ngebruk", "_blank")}
                className="w-full bg-[#00a753] text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-[#008c45] smooth-transition"
              >
                Buka GitHub
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`w-full bg-gray-100 py-4 md:py-4 smooth-transition ${mounted ? "smooth-reveal stagger-4" : "animate-on-load"}`}>
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

export default PanduanPage;
