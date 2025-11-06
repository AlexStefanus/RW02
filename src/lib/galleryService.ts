import { supabase } from "@/lib/supabase";
import { canUploadFile } from "./storageService";

let storageRefreshCallback: (() => void) | null = null;

export const setStorageRefreshCallback = (callback: () => void) => {
  storageRefreshCallback = callback;
};

const refreshStorageStats = () => {
  if (storageRefreshCallback) {
    storageRefreshCallback();
  }
};

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  imagePath: string;
  category?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  image: File;
  category?: string;
  isActive: boolean;
  order: number;
  createdBy: string;
}

export interface UpdateGalleryImageData {
  title?: string;
  description?: string;
  image?: File;
  category?: string;
  isActive?: boolean;
  order?: number;
  updatedBy: string;
}

export const uploadGalleryImage = async (file: File, imageId?: string): Promise<{ url: string; path: string }> => {
  try {
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message || "Storage penuh!");
    }

    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `gallery/${imageId || "temp"}_${fileName}`;

    const { data, error } = await supabase.storage
      .from("public")
      .upload(imagePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("public")
      .getPublicUrl(imagePath);

    refreshStorageStats();

    return {
      url: urlData.publicUrl,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error uploading gallery image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteGalleryImage = async (imagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from("public")
      .remove([imagePath]);

    if (error) throw error;
    
    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete image");
  }
};

export const createGalleryImage = async (data: CreateGalleryImageData): Promise<GalleryImage> => {
  try {
    const now = new Date().toISOString();

    const { data: insertedData, error } = await supabase
      .from("gallery")
      .insert([{
        title: data.title,
        description: data.description || "",
        imageUrl: "",
        imagePath: "",
        category: data.category || "umum",
        isActive: data.isActive,
        order: data.order,
        createdAt: now,
        updatedAt: now,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      }])
      .select()
      .single();

    if (error) throw error;

    const { url, path } = await uploadGalleryImage(data.image, insertedData.id);

    const { data: updatedData, error: updateError } = await supabase
      .from("gallery")
      .update({
        imageUrl: url,
        imagePath: path,
      })
      .eq("id", insertedData.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedData as GalleryImage;
  } catch (error) {
    console.error("Error creating gallery image:", error);
    throw new Error("Failed to create gallery image");
  }
};

export const getGalleryImages = async (
  pageSize: number = 10,
  lastId?: string,
  statusFilter?: "all" | "active" | "inactive"
): Promise<{ images: GalleryImage[]; lastVisible: string | null }> => {
  try {
    let query = supabase
      .from("gallery")
      .select("*")
      .order("updatedAt", { ascending: false })
      .limit(pageSize * 2);

    if (lastId) {
      const { data: lastDoc } = await supabase
        .from("gallery")
        .select("updatedAt")
        .eq("id", lastId)
        .single();
      
      if (lastDoc) {
        query = query.lt("updatedAt", lastDoc.updatedAt);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    let allImages = (data || []) as GalleryImage[];

    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      allImages = allImages.filter((image) => image.isActive === isActive);
    }

    const images = allImages.slice(0, pageSize);
    const lastVisible = images.length > 0 ? images[images.length - 1].id : null;

    return { images, lastVisible };
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw new Error("Gagal memuat galeri. Silakan coba lagi.");
  }
};

export const getGalleryImageById = async (id: string): Promise<GalleryImage | null> => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as GalleryImage;
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    throw new Error("Failed to fetch gallery image");
  }
};

export const updateGalleryImage = async (id: string, data: UpdateGalleryImageData): Promise<GalleryImage> => {
  try {
    const currentImage = await getGalleryImageById(id);
    if (!currentImage) {
      throw new Error("Gallery image not found");
    }

    let updateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: data.updatedBy,
    };

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.order !== undefined) updateData.order = data.order;

    if (data.image) {
      if (currentImage.imagePath) {
        await deleteGalleryImage(currentImage.imagePath);
      }

      const { url, path } = await uploadGalleryImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    const { data: updatedData, error } = await supabase
      .from("gallery")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return updatedData as GalleryImage;
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw new Error("Failed to update gallery image");
  }
};

export const deleteGalleryImageById = async (id: string): Promise<void> => {
  try {
    const currentImage = await getGalleryImageById(id);
    if (currentImage && currentImage.imagePath) {
      await deleteGalleryImage(currentImage.imagePath);
    }

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw new Error("Failed to delete gallery image");
  }
};

export const getActiveGalleryImages = async (limitCount?: number): Promise<GalleryImage[]> => {
  try {
    let query = supabase
      .from("gallery")
      .select("*")
      .eq("isActive", true)
      .order("updatedAt", { ascending: false });

    if (limitCount) {
      query = query.limit(limitCount);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as GalleryImage[];
  } catch (error) {
    console.error("Error fetching active gallery images:", error);
    return [];
  }
};

export const searchGalleryImages = async (searchTerm: string): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order("updatedAt", { ascending: false });

    if (error) throw error;

    return (data || []) as GalleryImage[];
  } catch (error) {
    console.error("Error searching gallery images:", error);
    throw new Error("Gagal mencari gambar galeri");
  }
};

export const getGalleryImagesWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  statusFilter: "all" | "active" | "inactive" = "all"
): Promise<{ images: GalleryImage[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    let countQuery = supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      countQuery = countQuery.eq("isActive", isActive);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let dataQuery = supabase
      .from("gallery")
      .select("*")
      .order("updatedAt", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      dataQuery = dataQuery.eq("isActive", isActive);
    }

    const { data, error } = await dataQuery;

    if (error) throw error;

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      images: (data || []) as GalleryImage[],
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching gallery images with pagination:", error);
    throw new Error("Gagal memuat gambar galeri");
  }
};

export const getGalleryImageCountByStatus = async (statusFilter: "all" | "active" | "inactive" = "all"): Promise<number> => {
  try {
    let query = supabase
      .from("gallery")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      query = query.eq("isActive", isActive);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error("Error counting gallery images:", error);
    return 0;
  }
};
