import { supabase } from "./supabase";
import { UserProfile } from "./auth";

export interface UserListItem extends UserProfile {
  id: string;
}

export const getAllUsers = async (): Promise<UserListItem[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const users: UserListItem[] = (data || []).map((user) => ({
      id: user.uid,
      ...user,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getUsersByRole = async (role: "admin" | "pending"): Promise<UserListItem[]> => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", role)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    const users: UserListItem[] = (data || []).map((user) => ({
      id: user.uid,
      ...user,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw new Error("Failed to fetch users by role");
  }
};

export const updateUserRole = async (userId: string, newRole: "admin" | "pending"): Promise<void> => {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        role: newRole,
        updatedAt: new Date().toISOString(),
      })
      .eq("uid", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("uid", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

export const getUserStats = async () => {
  try {
    const [allUsers, pendingUsers, adminUsers] = await Promise.all([getAllUsers(), getUsersByRole("pending"), getUsersByRole("admin")]);

    return {
      totalUsers: allUsers.length,
      pendingUsers: pendingUsers.length,
      adminUsers: adminUsers.length,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw new Error("Failed to fetch user stats");
  }
};

