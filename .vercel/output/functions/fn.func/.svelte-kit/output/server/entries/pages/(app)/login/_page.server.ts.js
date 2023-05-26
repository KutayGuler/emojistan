import { r as redirect, f as fail } from "../../../../chunks/index.js";
import { AuthApiError } from "@supabase/supabase-js";
async function load({ locals: { getSession } }) {
  const session = await getSession();
  if (session) {
    throw redirect(302, "/");
  }
}
const actions = {
  login: async ({ request, locals: { supabase } }) => {
    const body = Object.fromEntries(await request.formData());
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    });
    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          error: "Invalid credentials"
        });
      }
      return fail(500, {
        error: "Server error. Try again later."
      });
    }
    throw redirect(303, "/");
  },
  login_with_google: async ({ request, locals: { supabase } }) => {
    Object.fromEntries(await request.formData());
    const { data, error: err } = await supabase.auth.signInWithOAuth({
      provider: "google"
    });
    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          error: "Invalid credentials"
        });
      }
      return fail(500, {
        error: "Server error. Try again later."
      });
    }
    throw redirect(303, "/");
  }
};
export {
  actions,
  load
};
