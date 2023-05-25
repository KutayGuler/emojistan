import { redirect, error, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
  const { error: err } = await supabase.auth.signOut()

  if (err) {
    throw error(500, 'Something went wrong logging you out.')
  }

  // FIXME: redirecting also returns 500

  throw redirect(303, '/')
};