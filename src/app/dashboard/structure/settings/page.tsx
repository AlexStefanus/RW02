"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiImage, FiUsers, FiSave } from "react-icons/fi";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { getStructureSettings, updateStructureSettings, StructureSettings } from "@/lib/settingsService";

const StructureSettingsPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StructureSettings | null>(null);
  const [displayMode, setDisplayMode] = useState<"image" | "chart">("chart");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await getStructureSettings();
    if (data) {
      setSettings(data);
      setDisplayMode(data.displayMode);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    console.log("[Settings Page] Save clicked, displayMode:", displayMode);
    console.log("[Settings Page] User:", user);
    
    if (!user) {
      setError("Anda harus login untuk menyimpan pengaturan");
      return;
    }

    setSaving(true);
    setError(null);

    console.log("[Settings Page] Calling updateStructureSettings...");
    const result = await updateStructureSettings(displayMode, user.id);
    console.log("[Settings Page] Save result:", result);

    setSaving(false);

    if (result) {
      setSuccess("Pengaturan berhasil disimpan!");
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } else {
      setError("Gagal menyimpan pengaturan");
    }
  };

  const headerActions = (
    <ActionButton 
      variant="primary" 
      onClick={handleSave} 
      disabled={saving || loading}
      className="flex items-center gap-2"
    >
      <FiSave size={16} />
      {saving ? "Menyimpan..." : "Simpan Pengaturan"}
    </ActionButton>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader 
          title="Pengaturan Tampilan Struktur" 
          subtitle="Pilih cara menampilkan struktur organisasi" 
          mounted={mounted} 
        />
        <div className="app-content flex items-center justify-center">
          <p className="text-gray-500">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader 
        title="Pengaturan Tampilan Struktur" 
        subtitle="Pilih cara menampilkan struktur organisasi di halaman publik" 
        actions={headerActions}
        mounted={mounted} 
      />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <div className="space-y-6">
            {/* Display Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mode Tampilan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image Mode */}
                <button
                  type="button"
                  onClick={() => setDisplayMode("image")}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    displayMode === "image"
                      ? "border-[#00a753] bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      displayMode === "image" ? "bg-[#00a753]" : "bg-gray-200"
                    }`}>
                      <FiImage size={28} className={displayMode === "image" ? "text-white" : "text-gray-500"} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Gambar Struktur</h3>
                    <p className="text-sm text-gray-600">
                      Tampilkan gambar struktur.png dari folder public
                    </p>
                  </div>
                </button>

                {/* Chart Mode */}
                <button
                  type="button"
                  onClick={() => setDisplayMode("chart")}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    displayMode === "chart"
                      ? "border-[#00a753] bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      displayMode === "chart" ? "bg-[#00a753]" : "bg-gray-200"
                    }`}>
                      <FiUsers size={28} className={displayMode === "chart" ? "text-white" : "text-gray-500"} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bagan Organisasi</h3>
                    <p className="text-sm text-gray-600">
                      Tampilkan struktur dinamis dari data pengurus
                    </p>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureSettingsPage;
