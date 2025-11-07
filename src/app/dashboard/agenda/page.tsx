"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiClock } from "react-icons/fi";
import PageHeader from "@/component/common/PageHeader";
import { getAllAgendas, deleteAgenda, type Agenda } from "@/lib/agendaService";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const AgendaPage = () => {
  const [mounted, setMounted] = useState(false);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadAgendas();
  }, []);

  const loadAgendas = async () => {
    try {
      setLoading(true);
      const data = await getAllAgendas();
      setAgendas(data);
    } catch (error) {
      console.error("Error loading agendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus agenda ini?")) return;

    try {
      setDeleteId(id);
      await deleteAgenda(id);
      await loadAgendas();
    } catch (error) {
      console.error("Error deleting agenda:", error);
      alert("Gagal menghapus agenda");
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, dd MMMM yyyy", { locale: idLocale });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: idLocale });
    } catch {
      return "";
    }
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date();
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Kelola Agenda"
        subtitle="Kelola agenda dan kegiatan RW 02 Rangkah"
        mounted={mounted}
        actions={
          <button
            onClick={() => (window.location.href = "/dashboard/agenda/create")}
            className="bg-[#00a753] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#008c45] transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <FiPlus size={16} />
            <span>Tambah Agenda</span>
          </button>
        }
      />

      <div className={`app-content flex-1 ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : agendas.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Agenda</h3>
            <p className="text-gray-600 mb-6">Mulai tambahkan agenda kegiatan RW 02 Rangkah</p>
            <button
              onClick={() => (window.location.href = "/dashboard/agenda/create")}
              className="bg-[#00a753] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#008c45] transition-all inline-flex items-center gap-2"
            >
              <FiPlus size={16} />
              Tambah Agenda Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((agenda, index) => (
              <div
                key={agenda.id}
                className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all smooth-transition ${
                  mounted ? "smooth-reveal" : "animate-on-load"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {isUpcoming(agenda.date) && (
                      <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-2">
                        Akan Datang
                      </span>
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {agenda.title}
                    </h3>
                  </div>
                </div>

                {agenda.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{agenda.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="text-[#00a753] flex-shrink-0" size={16} />
                    <span className="line-clamp-1">{formatDate(agenda.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiClock className="text-[#00a753] flex-shrink-0" size={16} />
                    <span>{formatTime(agenda.date)} WIB</span>
                  </div>
                  {agenda.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiMapPin className="text-[#00a753] flex-shrink-0" size={16} />
                      <span className="line-clamp-1">{agenda.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => (window.location.href = `/dashboard/agenda/edit/${agenda.id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                  >
                    <FiEdit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agenda.id)}
                    disabled={deleteId === agenda.id}
                    className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FiTrash2 size={14} />
                    {deleteId === agenda.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaPage;
