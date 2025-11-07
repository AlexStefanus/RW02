"use client";

import { FiPlus, FiEdit2, FiTrash2, FiImage, FiCalendar, FiUser } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import PageHeader from "@/component/common/PageHeader";
import ActionButton from "@/component/common/ActionButton";
import { DataTableWithStates } from "@/component/common/LoadingStates";
import { useStructures, useStructureActions } from "@/hooks/useStructure";
import { confirmDelete, showSuccess, showError } from "@/utils/confirmationUtils";

const StructurePage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { structures, loading, error, refetch, clearError } = useStructures();
  const { remove } = useStructureActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string | number) => {
    const structure = structures.find((s) => s.id === id);
    const structureName = structure?.personName || "item ini";

    const confirmed = await confirmDelete("Hapus Pengurus?", `Data pengurus "${structureName}" akan dihapus secara permanen dan tidak dapat dikembalikan!`, "Ya, Hapus Data!");

    if (!confirmed) return;

    const success = await remove(String(id));
    if (success) {
      showSuccess("Struktur Berhasil Dihapus", `Struktur "${structureName}" berhasil dihapus dari sistem`);
      refetch();
    } else {
      showError("Gagal Menghapus Struktur", "Terjadi kesalahan saat menghapus struktur");
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/dashboard/structure/update?id=${id}`);
  };

  const handleViewPublic = (structure: any) => {
    if (structure.isActive) {
      return `/struktur?id=${structure.id}`;
    }
    return null;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "dd MMM yyyy", { locale: idLocale });
    } catch (error) {
      return "-";
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{isActive ? "Aktif" : "Nonaktif"}</span>;
  };

  const columns = [
    {
      key: "imageUrl",
      label: "Gambar",
      render: (value: string) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Structure"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/struktur-desa.png";
              }}
            />
          ) : (
            <FiImage className="text-gray-400" size={24} />
          )}
        </div>
      ),
    },
    {
      key: "personName",
      label: "Nama Pengurus",
      className: "font-medium text-gray-900",
    },
    {
      key: "position",
      label: "Jabatan",
      render: (value: string) => <span className="text-sm text-gray-600">{value || "-"}</span>,
    },
    {
      key: "order",
      label: "Urutan",
      className: "text-center",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => getStatusBadge(value),
    },
    {
      key: "updatedAt",
      label: "Terakhir Diubah",
      render: (value: any) => (
        <div className="flex items-center text-sm text-gray-900">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
          {formatDate(value)}
        </div>
      ),
    },
  ];

  const headerActions = (
    <Link href="/dashboard/structure/create">
      <ActionButton variant="primary" className="flex items-center gap-2 whitespace-nowrap">
        <FiPlus size={14} />
        Tambah Struktur
      </ActionButton>
    </Link>
  );

  if (error && !error.includes("tidak ditemukan") && structures.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <PageHeader title="Kelola Struktur" subtitle="Kelola Struktur Pengurus RW 02 Rangkah " actions={headerActions} mounted={mounted} />
        <div className="app-content">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader title="Kelola Struktur" subtitle="Kelola Struktur Pengurus RW 02 Rangkah " actions={headerActions} mounted={mounted} />

      <div className={`app-content smooth-transition flex-1 ${mounted ? "smooth-reveal stagger-1" : "animate-on-load"}`}>
        <div className="bg-white app-card shadow-sm border border-gray-100 hover-lift smooth-transition">
          <DataTableWithStates
            columns={columns}
            data={structures}
            editRoute={handleEdit}
            onDelete={handleDelete}
            viewRoute={handleViewPublic}
            mounted={mounted}
            loading={loading && structures.length === 0}
            error={null}
            onRetry={refetch}
            emptyMessage="Tidak ada data
Belum ada struktur yang dibuat."
          />
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

export default StructurePage;

