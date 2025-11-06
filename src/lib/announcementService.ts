import { supabase } from "./supabase";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  status: "active" | "inactive" | "expired";
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  priority: "normal" | "penting" | "urgent";
  authorId: string;
  authorName: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  priority?: "normal" | "penting" | "urgent";
  status?: "active" | "inactive" | "expired";
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
};

const determineStatus = (startDate: string, endDate: string): "active" | "inactive" | "expired" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "inactive";
  } else if (now > end) {
    return "expired";
  } else {
    return "active";
  }
};

export const createAnnouncement = async (data: CreateAnnouncementData): Promise<Announcement> => {
  try {
    const slug = generateSlug(data.title);
    const status = determineStatus(data.startDate, data.endDate);
    const now = new Date().toISOString();

    const announcementData = {
      ...data,
      slug,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const { data: insertedData, error } = await supabase
      .from("announcements")
      .insert([announcementData])
      .select()
      .single();

    if (error) throw error;

    return insertedData as Announcement;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
};

export const getAnnouncements = async (
  pageSize: number = 10,
  lastId?: string,
  statusFilter?: "all" | "active" | "inactive" | "expired"
): Promise<{ announcements: Announcement[]; lastVisible: string | null }> => {
  try {
    let query = supabase
      .from("announcements")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(pageSize);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (lastId) {
      const { data: lastDoc } = await supabase
        .from("announcements")
        .select("createdAt")
        .eq("id", lastId)
        .single();
      
      if (lastDoc) {
        query = query.lt("createdAt", lastDoc.createdAt);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    const announcements = (data || []) as Announcement[];
    const lastVisible = announcements.length > 0 ? announcements[announcements.length - 1].id : null;

    return { announcements, lastVisible };
  } catch (error) {
    console.error("Error getting announcements:", error);
    throw new Error("Gagal memuat pengumuman. Silakan coba lagi.");
  }
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Announcement;
  } catch (error) {
    console.error("Error getting announcement:", error);
    throw error;
  }
};

export const getAnnouncementBySlug = async (slug: string): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Announcement;
  } catch (error) {
    console.error("Error getting announcement by slug:", error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, data: UpdateAnnouncementData): Promise<Announcement> => {
  try {
    let updateData: any = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    if (data.startDate && data.endDate) {
      updateData.status = determineStatus(data.startDate, data.endDate);
    } else if (data.startDate || data.endDate) {
      const current = await getAnnouncementById(id);
      if (current) {
        const startDate = data.startDate || current.startDate;
        const endDate = data.endDate || current.endDate;
        updateData.status = determineStatus(startDate, endDate);
      }
    }

    const { data: updatedData, error } = await supabase
      .from("announcements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return updatedData as Announcement;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
};

export const getActiveAnnouncements = async (limitCount: number = 10): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("status", "active")
      .order("priority", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(limitCount);

    if (error) throw error;

    return (data || []) as Announcement[];
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    return [];
  }
};

export const searchAnnouncements = async (searchTerm: string): Promise<Announcement[]> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return (data || []) as Announcement[];
  } catch (error) {
    console.error("Error searching announcements:", error);
    throw new Error("Gagal mencari pengumuman. Silakan coba lagi.");
  }
};

export const getAnnouncementsWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  statusFilter: "all" | "active" | "inactive" | "expired" = "all"
): Promise<{ announcements: Announcement[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    let countQuery = supabase
      .from("announcements")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      countQuery = countQuery.eq("status", statusFilter);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let dataQuery = supabase
      .from("announcements")
      .select("*")
      .order("createdAt", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (statusFilter !== "all") {
      dataQuery = dataQuery.eq("status", statusFilter);
    }

    const { data, error } = await dataQuery;

    if (error) throw error;

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      announcements: (data || []) as Announcement[],
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching announcements with pagination:", error);
    throw new Error("Gagal memuat pengumuman");
  }
};

export const getAnnouncementCountByStatus = async (statusFilter: "all" | "active" | "inactive" | "expired" = "all"): Promise<number> => {
  try {
    let query = supabase
      .from("announcements")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error("Error counting announcements:", error);
    return 0;
  }
};
