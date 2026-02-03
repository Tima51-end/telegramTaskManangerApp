import { SupabaseClient } from "@supabase/supabase-js";

export interface ITask {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
}

export const taskService = {
  async getAll(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("TTA")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;
    return data as ITask[];
  },

  async create(
    supabase: SupabaseClient,
    task: {
      user_id: string;
      text: string;
      completed: boolean;
      created_at: string;
    },
  ) {
    const { error } = await supabase.from("TTA").insert([task]);

    if (error) throw error;
  },

  async toggle(supabase: SupabaseClient, id: number, completed: boolean) {
    const { error } = await supabase
      .from("TTA")
      .update({ completed })
      .eq("id", id);

    if (error) throw error;
  },

  async delete(supabase: SupabaseClient, id: number) {
    const { error } = await supabase.from("TTA").delete().eq("id", id);

    if (error) throw error;
  },
};
