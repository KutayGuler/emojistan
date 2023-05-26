import { P as PUBLIC_SUPABASE_URL, a as PUBLIC_SUPABASE_ANON_KEY } from "../../chunks/public.js";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import "../../chunks/store.js";
const load = async ({ fetch, data, depends }) => {
  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session
  });
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return { supabase, session, username: data.username };
};
export {
  load
};
