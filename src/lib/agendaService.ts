import { supabase } from "./supabase";

export interface Agenda {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  created_at: string;
}

export interface CreateAgendaInput {
  title: string;
  description?: string;
  date: string;
  location?: string;
}

export interface UpdateAgendaInput {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
}

export const getAllAgendas = async (): Promise<Agenda[]> => {
  const { data, error } = await supabase
    .from("agenda")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching agendas:", error);
    throw error;
  }

  return data || [];
};

export const getUpcomingAgendas = async (): Promise<Agenda[]> => {
  const today = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("agenda")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching upcoming agendas:", error);
    throw error;
  }

  return data || [];
};

export const getAgendaById = async (id: string): Promise<Agenda | null> => {
  const { data, error } = await supabase
    .from("agenda")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching agenda:", error);
    throw error;
  }

  return data;
};

export const createAgenda = async (input: CreateAgendaInput): Promise<Agenda> => {
  const { data, error } = await supabase
    .from("agenda")
    .insert([input])
    .select()
    .single();

  if (error) {
    console.error("Error creating agenda:", error);
    throw error;
  }

  return data;
};

export const updateAgenda = async (
  id: string,
  input: UpdateAgendaInput
): Promise<Agenda> => {
  const { data, error } = await supabase
    .from("agenda")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating agenda:", error);
    throw error;
  }

  return data;
};

export const deleteAgenda = async (id: string): Promise<void> => {
  const { error } = await supabase.from("agenda").delete().eq("id", id);

  if (error) {
    console.error("Error deleting agenda:", error);
    throw error;
  }
};

export const getAgendasCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from("agenda")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error counting agendas:", error);
    throw error;
  }

  return count || 0;
};

export const getUpcomingAgendasCount = async (): Promise<number> => {
  const today = new Date().toISOString();
  
  const { count, error } = await supabase
    .from("agenda")
    .select("*", { count: "exact", head: true })
    .gte("date", today);

  if (error) {
    console.error("Error counting upcoming agendas:", error);
    throw error;
  }

  return count || 0;
};
