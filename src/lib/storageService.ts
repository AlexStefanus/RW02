import { supabase } from "@/lib/supabase";

export interface StorageStats {
  totalSize: number;
  articleImagesSize: number;
  galleryImagesSize: number;
  structureImagesSize: number;
  fileCount: number;
  lastUpdated: Date;
}

export interface StorageItem {
  name: string;
  size: number;
  type: "article" | "gallery" | "structure";
  path: string;
}

const MAX_STORAGE_BYTES = 4.95 * 1024 * 1024 * 1024;

export const getStorageStats = async (): Promise<StorageStats> => {
  try {
    const [articlesStats, galleryStats, structuresStats] = await Promise.all([
      calculateFolderSize("articles"),
      calculateFolderSize("gallery"),
      calculateFolderSize("structures"),
    ]);

    return {
      totalSize: articlesStats.totalSize + galleryStats.totalSize + structuresStats.totalSize,
      articleImagesSize: articlesStats.totalSize,
      galleryImagesSize: galleryStats.totalSize,
      structureImagesSize: structuresStats.totalSize,
      fileCount: articlesStats.fileCount + galleryStats.fileCount + structuresStats.fileCount,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error("Error getting storage stats:", error);
    throw new Error("Failed to get storage statistics");
  }
};

const calculateFolderSize = async (folderPath: string): Promise<{ totalSize: number; fileCount: number }> => {
  try {
    const { data, error } = await supabase.storage.from("public").list(folderPath, {
      limit: 1000,
      offset: 0,
    });

    if (error) {
      console.warn(`Failed to list files in ${folderPath}:`, error);
      return { totalSize: 0, fileCount: 0 };
    }

    let totalSize = 0;
    let fileCount = 0;

    if (data) {
      for (const item of data) {
        if (item.metadata && typeof item.metadata.size === "number") {
          totalSize += item.metadata.size;
          fileCount++;
        }
      }
    }

    return { totalSize, fileCount };
  } catch (error) {
    console.error(`Error calculating folder size for ${folderPath}:`, error);
    return { totalSize: 0, fileCount: 0 };
  }
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const getStoragePercentage = (usedBytes: number): number => {
  return Math.min((usedBytes / MAX_STORAGE_BYTES) * 100, 100);
};

export const getMaxStorageFormatted = (): string => {
  return formatBytes(MAX_STORAGE_BYTES);
};

export const getRemainingStorage = (usedBytes: number): number => {
  return Math.max(MAX_STORAGE_BYTES - usedBytes, 0);
};

export const getStorageColor = (percentage: number): string => {
  if (percentage < 70) return "bg-green-500";
  if (percentage < 85) return "bg-yellow-500";
  return "bg-red-500";
};

export const isStorageFull = (usedBytes: number, threshold: number = 95): boolean => {
  const percentage = getStoragePercentage(usedBytes);
  return percentage >= threshold;
};

export const canUploadFile = async (fileSize: number, threshold: number = 95): Promise<{ canUpload: boolean; message?: string }> => {
  try {
    const stats = await getStorageStats();
    const currentUsage = stats.totalSize;
    const afterUpload = currentUsage + fileSize;

    if (isStorageFull(afterUpload, threshold)) {
      const remainingSpace = getRemainingStorage(currentUsage);
      return {
        canUpload: false,
        message: `Storage hampir penuh! Tersisa ${formatBytes(remainingSpace)}. File yang akan diupload (${formatBytes(fileSize)}) akan melebihi batas storage.`,
      };
    }

    return { canUpload: true };
  } catch (error) {
    console.error("Error checking storage capacity:", error);
    return {
      canUpload: false,
      message: "Gagal mengecek kapasitas storage. Silakan coba lagi.",
    };
  }
};
