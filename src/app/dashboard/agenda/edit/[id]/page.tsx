"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHeader from "@/component/common/PageHeader";
import { getAgendaById, updateAgenda } from "@/lib/agendaService";
import { FiSave, FiX } from "react-icons/fi";

const EditAgendaPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [mounted, setMounted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  useEffect(() => {
    loadAgenda();
  }, [id]);

  const loadAgenda = async () => {
    try {
      setLoadingData(true);
      const agenda = await getAgendaById(id);
      if (agenda) {
        const dateObj = new Date(agenda.date);
        const date = dateObj.toISOString().split("T")[0];
        const time = dateObj.toTimeString().slice(0, 5);

        setFormData({
          title: agenda.title,
          description: agenda.description || "",
          date,
          time,
          location: agenda.location || "",
        });
      }
    } catch (error) {
      console.error("Error loading agenda:", error);
      alert("Gagal memuat data agenda");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time) {
      alert("Mohon isi semua field yang wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const dateTime = `${formData.date}T${formData.time}:00`;

      await updateAgenda(id, {
        title: formData.title,
        description: formData.description || undefined,
        date: dateTime,
        location: formData.location || undefined,
      });

      alert("Agenda berhasil diperbarui!");
      router.push("/dashboard/agenda");
    } catch (error) {
      console.error("Error updating agenda:", error);
      alert("Gagal memperbarui agenda");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a753] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Memuat data agenda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Edit Agenda"
        subtitle="Perbarui informasi agenda"
        mounted={mounted}
      />

      <div className={`app-content flex-1 ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Agenda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a753] focus:border-transparent transition-all"
                  placeholder="Contoh: Rapat RT Bulanan"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a753] focus:border-transparent transition-all resize-none"
                  placeholder="Deskripsi singkat tentang agenda..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a753] focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a753] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a753] focus:border-transparent transition-all"
                  placeholder="Contoh: Balai RW 02"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/dashboard/agenda")}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <FiX size={16} />
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#00a753] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#008c45] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <FiSave size={16} />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAgendaPage;
