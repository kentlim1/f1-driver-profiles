import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://hcomdpqwuxfdpzobxqoe.supabase.co";
const supabaseAnonKey = "sb_publishable_5rMJ8Nipm-yELaRCbQQtNA_Mqg_cPIV";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);