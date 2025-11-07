import { supabase } from "./supabase";
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

export interface StructureItem {
  id: string;
  personName: string;
  position: string;
  imageUrl: string;
  imagePath: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CreateStructureData {
  personName: string;
  position: string;
  image: File;
  order: number;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateStructureData {
  personName?: string;
  position?: string;
  image?: File;
  order?: number;
  isActive?: boolean;
  updatedBy: string;
}

const uploadStructureImage = async (file: File, structureId?: string): Promise<{ url: string; path: string }> => {
  try {
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message);
    }

    const fileName = structureId ? `${structureId}.${file.name.split(".").pop()}` : `${Date.now()}_${file.name}`;
    const imagePath = `structures/${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(imagePath, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(imagePath);

    refreshStorageStats();

    return {
      url: urlData.publicUrl,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error uploading structure image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload structure image");
  }
};

const deleteStructureImage = async (imagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from("uploads")
      .remove([imagePath]);

    if (error) throw error;
    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting structure image:", error);
  }
};

export const createStructure = async (data: CreateStructureData): Promise<StructureItem> => {
  try {
    const now = new Date().toISOString();

    const { data: insertedData, error } = await supabase
      .from("structures")
      .insert([{
        personName: data.personName,
        position: data.position,
        imageUrl: "",
        imagePath: "",
        order: data.order,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      }])
      .select()
      .single();

    if (error) throw error;

    const { url, path } = await uploadStructureImage(data.image, insertedData.id);

    const { data: updatedData, error: updateError } = await supabase
      .from("structures")
      .update({
        imageUrl: url,
        imagePath: path,
      })
      .eq("id", insertedData.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return updatedData as StructureItem;
  } catch (error) {
    console.error("Error creating structure:", error);
    throw new Error("Failed to create structure");
  }
};

export const getStructures = async (): Promise<StructureItem[]> => {
  try {
    const { data, error } = await supabase
      .from("structures")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    return (data || []) as StructureItem[];
  } catch (error) {
    console.error("Error getting structures:", error);
    return [];
  }
};

export const getStructureById = async (id: string): Promise<StructureItem | null> => {
  try {
    const { data, error } = await supabase
      .from("structures")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as StructureItem;
  } catch (error) {
    console.error("Error getting structure:", error);
    throw new Error("Failed to get structure");
  }
};

export const updateStructure = async (id: string, data: UpdateStructureData): Promise<StructureItem> => {
  try {
    const currentStructure = await getStructureById(id);
    if (!currentStructure) {
      throw new Error("Structure not found");
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
      updatedBy: data.updatedBy,
    };

    if (data.personName) updateData.personName = data.personName;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    if (data.image) {
      if (currentStructure.imagePath) {
        await deleteStructureImage(currentStructure.imagePath);
      }

      const { url, path } = await uploadStructureImage(data.image, id);
      updateData.imageUrl = url;
      updateData.imagePath = path;
    }

    const { data: updatedData, error } = await supabase
      .from("structures")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return updatedData as StructureItem;
  } catch (error) {
    console.error("Error updating structure:", error);
    throw new Error("Failed to update structure");
  }
};

export const deleteStructure = async (id: string): Promise<void> => {
  try {
    const currentStructure = await getStructureById(id);
    if (currentStructure && currentStructure.imagePath) {
      await deleteStructureImage(currentStructure.imagePath);
    }

    const { error } = await supabase
      .from("structures")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting structure:", error);
    throw new Error("Failed to delete structure");
  }
};

export const getActiveStructures = async (): Promise<StructureItem[]> => {
  try {
    const { data, error } = await supabase
      .from("structures")
      .select("*")
      .eq("isActive", true)
      .order("order", { ascending: true });

    if (error) throw error;

    return (data || []) as StructureItem[];
  } catch (error) {
    console.error("Error getting active structures:", error);
    return [];
  }
};
