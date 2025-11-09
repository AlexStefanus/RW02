"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/component/common/PageHeader";
import FormInput from "@/component/common/FormInput";
import ActionButton from "@/component/common/ActionButton";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthActions } from "@/hooks/useAuth";

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const { profile, user, refreshProfile } = useAuth();
  const { updateProfile, loading, error, clearError } = useAuthActions();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    role: profile?.role || "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (success || error) {
      setSuccess(null);
      clearError();
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    const updateData = {
      name: formData.name,
    };

    const result = await updateProfile(user.id, updateData);

    if (result.success) {
      setSuccess("Profil berhasil diperbarui!");
      setIsEditing(false);
      await refreshProfile();
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
      });
    }
    setIsEditing(false);
    setSuccess(null);
    clearError();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a753] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const headerActions = isEditing ? (
    <>
      <ActionButton variant="secondary" onClick={handleCancel} disabled={loading}>
        Batal
      </ActionButton>
      <ActionButton variant="primary" onClick={handleSave} disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </ActionButton>
    </>
  ) : (
    <ActionButton variant="primary" onClick={() => setIsEditing(true)}>
      Edit Profil
    </ActionButton>
  );

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Profil Pengguna" subtitle="Kelola informasi profil Anda" actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md smooth-transition">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md smooth-transition">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white app-card shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-[#00a753] rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{profile.name?.charAt(0).toUpperCase() || "A"}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 capitalize">{profile.role}</p>
            </div>
          </div>

          <form className="space-y-4">
            <FormInput label="Nama Lengkap" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama lengkap..." disabled={!isEditing} />

            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Masukkan email..." disabled={true} />

            <FormInput label="Role" name="role" value={formData.role} onChange={handleInputChange} placeholder="Role pengguna..." disabled={true} />

            <div className="pt-4">
              <label className="block text-xs font-medium text-black mb-2">UID Pengguna</label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <code className="text-sm text-gray-600">{profile.uid}</code>
              </div>
            </div>
          </form>
        </div>

        {/* Taman Baca Rangkah Section */}
        <div className="bg-white app-card shadow-sm border border-gray-100 mt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#00a753] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Taman Baca Rangkah</h3>
              <p className="text-gray-600 text-sm mb-4">
                Dapatkan akses menuju E-Book dari Taman Baca Rangkah
              </p>
              <a
                href="https://drive.google.com/drive/folders/1tAyrTev5Yy0umxxTFPxOXIERtT0VQ-hf?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a753] text-white text-sm font-medium rounded-md hover:bg-[#008f47] transition-colors smooth-transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Buka Taman Baca
              </a>
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

export default ProfilePage;
