import { supabase } from "./supabaseClient";

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { profile: null, user: null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return { profile, user };
}

export async function setMyUsername(username: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const clean = username.trim();

  // quick client validation 
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(clean)) {
    throw new Error("Username must be 3–20 chars: letters, numbers, underscore.");
  }

  // Update (will fail if unique constraint is violated)
  const { error } = await supabase
    .from("profiles")
    .update({ username: clean })
    .eq("id", user.id);

  if (error) {
    // Supabase Postgres unique violation code is 23505
    if ((error as any).code === "23505") {
      throw new Error("That username is taken.");
    }
    throw error;
  }
}

export async function getMyUsername(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data?.username ?? null;
}