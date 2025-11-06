import { supabase } from "./supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

// Type alias for compatibility
export type User = SupabaseUser;

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "admin" | "pending";
  createdAt: Date;
  updatedAt?: Date;
}

export interface AuthError {
  code: string;
  message: string;
}

export const signUpWithEmail = async (email: string, password: string, name: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    console.log("Starting sign up for:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      console.error("Supabase auth.signUp error:", error);
      throw error;
    }
    if (!data.user) throw new Error("No user returned");

    const userProfile: UserProfile = {
      uid: data.user.id,
      email: email,
      name: name,
      role: "pending",
      createdAt: new Date(),
    };

    const { error: insertError } = await supabase
      .from("users")
      .insert([userProfile]);

    if (insertError) {
      console.error("Error inserting user profile:", insertError);
      console.error("User profile data:", userProfile);
      throw insertError;
    }

    return { user: data.user, profile: userProfile };
  } catch (error: any) {
    return {
      error: {
        code: error.code || error.message,
        message: getAuthErrorMessage(error.code || error.message),
      },
    };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: User; profile: UserProfile } | { error: AuthError }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user returned");

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", data.user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    if (profileData) {
      return { user: data.user, profile: profileData as UserProfile };
    } else {
      const userProfile: UserProfile = {
        uid: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || "Admin",
        role: "admin",
        createdAt: new Date(),
      };

      const { error: insertError } = await supabase
        .from("users")
        .insert([userProfile]);

      if (insertError) throw insertError;

      return { user: data.user, profile: userProfile };
    }
  } catch (error: any) {
    return {
      error: {
        code: error.code || error.message,
        message: getAuthErrorMessage(error.code || error.message),
      },
    };
  }
};

export const signOutUser = async (): Promise<void | { error: AuthError }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    return {
      error: {
        code: error.code || error.message,
        message: getAuthErrorMessage(error.code || error.message),
      },
    };
  }
};

export const resetPassword = async (email: string): Promise<void | { error: AuthError }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
  } catch (error: any) {
    return {
      error: {
        code: error.code || error.message,
        message: getAuthErrorMessage(error.code || error.message),
      },
    };
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return data as UserProfile;
  } catch (error) {
    return null;
  }
};

export const updateUserProfile = async (uid: string, updateData: Partial<UserProfile>): Promise<{ profile: UserProfile } | { error: AuthError }> => {
  try {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq("uid", uid);

    if (updateError) throw updateError;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .single();

    if (error) throw error;

    if (data) {
      if (updateData.name) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { name: updateData.name },
        });
        if (metadataError) console.error("Error updating user metadata:", metadataError);
      }

      return { profile: data as UserProfile };
    } else {
      return {
        error: {
          code: "profile/not-found",
          message: "Profil pengguna tidak ditemukan",
        },
      };
    }
  } catch (error: any) {
    return {
      error: {
        code: error.code || error.message,
        message: getAuthErrorMessage(error.code || error.message),
      },
    };
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return data.subscription.unsubscribe;
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Akun tidak ditemukan. Silakan periksa email Anda.";
    case "auth/wrong-password":
      return "Kata sandi salah. Silakan coba lagi.";
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.";
    case "auth/weak-password":
      return "Kata sandi terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/invalid-email":
      return "Format email tidak valid.";
    case "auth/user-disabled":
      return "Akun telah dinonaktifkan.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Silakan coba lagi nanti.";
    case "auth/network-request-failed":
      return "Koneksi internet bermasalah. Silakan periksa koneksi Anda.";
    case "profile/not-found":
      return "Profil pengguna tidak ditemukan.";
    case "auth/missing-email":
      return "Email harus diisi.";
    default:
      return "Terjadi kesalahan. Silakan coba lagi.";
  }
};


