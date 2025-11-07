import { supabase } from "./supabase";

export interface StructureSettings {
  id: string;
  displayMode: "image" | "chart"; // "image" for static image (struktur.png), "chart" for organizational chart
  updatedAt: string;
  updatedBy: string;
}

export const getStructureSettings = async (): Promise<StructureSettings | null> => {
  try {
    console.log("[getStructureSettings] Fetching settings...");
    const { data, error } = await supabase
      .from("structure_settings")
      .select("*")
      .single();

    if (error) {
      console.log("[getStructureSettings] Error:", error);
      if (error.code === "PGRST116") {
        // No settings found, return default
        console.log("[getStructureSettings] No settings found, returning default");
        return {
          id: "",
          displayMode: "chart",
          updatedAt: new Date().toISOString(),
          updatedBy: "",
        };
      }
      throw error;
    }

    console.log("[getStructureSettings] Settings loaded:", data);
    return data as StructureSettings;
  } catch (error) {
    console.error("[getStructureSettings] Error getting structure settings:", error);
    return null;
  }
};

export const updateStructureSettings = async (
  displayMode: "image" | "chart",
  updatedBy?: string
): Promise<boolean> => {
  try {
    console.log("[updateStructureSettings] Saving displayMode:", displayMode);
    const now = new Date().toISOString();

    // Check if settings exist
    console.log("[updateStructureSettings] Checking for existing settings...");
    const { data: existing, error: selectError } = await supabase
      .from("structure_settings")
      .select("id")
      .single();

    console.log("[updateStructureSettings] Existing settings:", existing, "Error:", selectError);

    if (existing) {
      // Update existing
      console.log("[updateStructureSettings] Updating existing record with ID:", existing.id);
      const { error } = await supabase
        .from("structure_settings")
        .update({
          displayMode,
          updatedAt: now,
          updatedBy: updatedBy || "",
        })
        .eq("id", existing.id);

      if (error) {
        console.error("[updateStructureSettings] Update error:", error);
        throw error;
      }
      console.log("[updateStructureSettings] Update successful!");
    } else {
      // Insert new
      console.log("[updateStructureSettings] Inserting new record");
      const { error } = await supabase
        .from("structure_settings")
        .insert([{
          displayMode,
          updatedAt: now,
          updatedBy: updatedBy || "",
        }]);

      if (error) {
        console.error("[updateStructureSettings] Insert error:", error);
        throw error;
      }
      console.log("[updateStructureSettings] Insert successful!");
    }

    return true;
  } catch (error) {
    console.error("[updateStructureSettings] Error updating structure settings:", error);
    return false;
  }
};
