"use client";

import React, { useState, useRef } from "react";
import { FiUpload, FiX, FiEye } from "react-icons/fi";
import FormInput from "@/component/common/FormInput";
import FormTextarea from "@/component/common/FormTextarea";
import FormSelect from "@/component/common/FormSelect";
import { canUploadFile } from "@/lib/storageService";

interface ArticleFormProps {
  formData: {
    title: string;
    content: string;
    image: File | null;
    imageUrl?: string;
    status: "draft" | "published";
  };
  onChange: (field: string, value: string | File) => void;
  onStorageError: (message: string) => void;
  isEditing?: boolean;
  loading?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  formData,
  onChange,
  onStorageError,
  isEditing = false,
  loading = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      const storageCheck = await canUploadFile(file.size);
      if (!storageCheck.canUpload) {
        onStorageError(storageCheck.message || "Storage penuh!");
        return;
      }

      onChange("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      const storageCheck = await canUploadFile(file.size);
      if (!storageCheck.canUpload) {
        onStorageError(storageCheck.message || "Storage penuh!");
        return;
      }

      onChange("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onChange("image", null as any);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreviewImage = () => {
    const imageToPreview = previewUrl || formData.imageUrl;
    if (imageToPreview) {
      window.open(imageToPreview, "_blank");
    }
  };

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Berita {!isEditing && <span className="text-red-500">*</span>}
            </label>

            {(previewUrl || (isEditing && formData.imageUrl && !formData.image)) && (
              <div className="mb-4 relative">
                <img
                  src={previewUrl || formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handlePreviewImage}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Preview gambar"
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Hapus gambar"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    disabled={loading}
                  >
                    Ganti Gambar
                  </button>
                )}
              </div>
            )}

            {!previewUrl && !(isEditing && formData.imageUrl) && (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-[#00a753] bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-2">
                  <FiUpload size={16} />
                  <span className="text-gray-600 font-medium">{dragActive ? "Lepaskan gambar di sini" : "Drag & drop gambar atau klik untuk upload"}</span>
                </div>
                <p className="text-xs text-gray-500">{isEditing ? "Upload gambar baru untuk mengganti yang lama" : "Mendukung format: JPG, PNG, GIF (Max: 5MB)"}</p>
              </div>
            )}

            {((isEditing && formData.imageUrl && !previewUrl) || previewUrl) && <p className="text-xs text-gray-500 mt-2">Klik "Preview" untuk melihat gambar ukuran penuh di tab baru{isEditing && ", atau \"Ganti Gambar\" untuk memilih gambar lain"}</p>}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={loading} />
        </div>

        <div className="space-y-6">
          <FormInput label="Judul Berita" name="title" value={formData.title || ""} placeholder="Masukkan judul berita..." onChange={(e) => onChange("title", e.target.value)} disabled={loading} required />

          <FormTextarea label="Konten Berita" name="content" value={formData.content || ""} placeholder="Tulis konten berita di sini..." rows={10} onChange={(e) => onChange("content", e.target.value)} disabled={loading} required />

          <FormSelect label="Status" name="status" value={formData.status || "draft"} options={statusOptions} onChange={(e) => onChange("status", e.target.value)} disabled={loading} required />
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
