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

export interface Article {
  id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePath?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  slug: string;
  excerpt?: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  image?: File;
  authorId: string;
  authorName: string;
  status: "draft" | "published";
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  image?: File;
  status?: "draft" | "published";
}

const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

const createExcerpt = (content: string, maxLength: number = 150): string => {
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent;
};

export const uploadArticleImage = async (file: File, articleId?: string): Promise<{ url: string; path: string }> => {
  try {
    const storageCheck = await canUploadFile(file.size);
    if (!storageCheck.canUpload) {
      throw new Error(storageCheck.message || "Storage penuh!");
    }

    const fileName = `${Date.now()}_${file.name}`;
    const imagePath = `articles/${articleId || "temp"}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(imagePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(imagePath);

    refreshStorageStats();

    return { url: urlData.publicUrl, path: imagePath };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error instanceof Error ? error : new Error("Failed to upload image");
  }
};

export const deleteArticleImage = async (imagePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from("uploads")
      .remove([imagePath]);

    if (error) throw error;

    refreshStorageStats();
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  try {
    const slug = createSlug(data.title);
    const excerpt = createExcerpt(data.content);
    const now = new Date().toISOString();

    const articleData = {
      title: data.title,
      content: data.content,
      slug,
      excerpt,
      authorId: data.authorId,
      authorName: data.authorName,
      status: data.status,
      createdAt: now,
      updatedAt: now,
    };

    const { data: insertedData, error } = await supabase
      .from("articles")
      .insert([articleData])
      .select()
      .single();

    if (error) throw error;

    let imageUrl = "";
    let imagePath = "";

    if (data.image) {
      const uploadResult = await uploadArticleImage(data.image, insertedData.id);
      imageUrl = uploadResult.url;
      imagePath = uploadResult.path;

      const { error: updateError } = await supabase
        .from("articles")
        .update({ imageUrl, imagePath })
        .eq("id", insertedData.id);

      if (updateError) throw updateError;
    }

    return {
      ...insertedData,
      imageUrl,
      imagePath,
    } as Article;
  } catch (error) {
    console.error("Error creating article:", error);
    throw new Error("Failed to create article");
  }
};

export const getArticles = async (
  pageSize: number = 10,
  lastId?: string,
  statusFilter?: "all" | "published" | "draft"
): Promise<{ articles: Article[]; lastVisible: string | null }> => {
  try {
    let query = supabase
      .from("articles")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(pageSize);

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (lastId) {
      const { data: lastDoc } = await supabase
        .from("articles")
        .select("createdAt")
        .eq("id", lastId)
        .single();
      
      if (lastDoc) {
        query = query.lt("createdAt", lastDoc.createdAt);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    const articles = (data || []) as Article[];
    const lastVisible = articles.length > 0 ? articles[articles.length - 1].id : null;

    return { articles, lastVisible: lastVisible || null };
  } catch (error) {
    console.error("Error getting articles:", error);
    throw new Error("Gagal memuat artikel. Silakan coba lagi.");
  }
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Article;
  } catch (error) {
    console.error("Error getting article:", error);
    throw new Error("Failed to get article");
  }
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as Article;
  } catch (error) {
    console.error("Error getting article by slug:", error);
    throw new Error("Failed to get article");
  }
};

export const updateArticle = async (id: string, data: UpdateArticleData): Promise<Article> => {
  try {
    const currentArticle = await getArticleById(id);
    if (!currentArticle) {
      throw new Error("Article not found");
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (data.title && data.title !== currentArticle.title) {
      updateData.title = data.title;
      updateData.slug = createSlug(data.title);
    }

    if (data.content && data.content !== currentArticle.content) {
      updateData.content = data.content;
      updateData.excerpt = createExcerpt(data.content);
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (data.image) {
      if (currentArticle.imagePath) {
        await deleteArticleImage(currentArticle.imagePath);
      }

      const uploadResult = await uploadArticleImage(data.image, id);
      updateData.imageUrl = uploadResult.url;
      updateData.imagePath = uploadResult.path;
    }

    const { data: updatedData, error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return updatedData as Article;
  } catch (error) {
    console.error("Error updating article:", error);
    throw new Error("Failed to update article");
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const article = await getArticleById(id);
    if (!article) {
      throw new Error("Article not found");
    }

    if (article.imagePath) {
      await deleteArticleImage(article.imagePath);
    }

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting article:", error);
    throw new Error("Failed to delete article");
  }
};

export const searchArticles = async (searchTerm: string): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    return (data || []) as Article[];
  } catch (error) {
    console.error("Error searching articles:", error);
    throw new Error("Gagal mencari artikel. Silakan coba lagi.");
  }
};

export const getPublishedArticles = async (limitCount?: number): Promise<Article[]> => {
  try {
    let query = supabase
      .from("articles")
      .select("*")
      .eq("status", "published")
      .order("createdAt", { ascending: false });

    if (limitCount) {
      query = query.limit(limitCount);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []) as Article[];
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
};

export const getArticlesWithPagination = async (
  page: number = 1,
  pageSize: number = 10,
  statusFilter: "all" | "published" | "draft" = "all"
): Promise<{ articles: Article[]; totalPages: number; totalItems: number }> => {
  try {
    const offset = (page - 1) * pageSize;

    let countQuery = supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      countQuery = countQuery.eq("status", statusFilter);
    }

    const { count, error: countError } = await countQuery;

    if (countError) throw countError;

    let dataQuery = supabase
      .from("articles")
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
      articles: (data || []) as Article[],
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching articles with pagination:", error);
    throw new Error("Gagal memuat artikel");
  }
};

export const getArticleCountByStatus = async (statusFilter: "all" | "published" | "draft" = "all"): Promise<number> => {
  try {
    let query = supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { count, error } = await query;

    if (error) throw error;

    return count || 0;
  } catch (error) {
    console.error("Error counting articles:", error);
    return 0;
  }
};
