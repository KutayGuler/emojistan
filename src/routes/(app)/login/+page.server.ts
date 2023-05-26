import { redirect, type Actions, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { AuthApiError } from "@supabase/supabase-js";

// @ts-expect-error
export async function load({ locals: { getSession } }): PageServerLoad {
  const session = await getSession();

  if (session) {
    throw redirect(302, "/");
  }
}

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const body = Object.fromEntries(await request.formData())

    const { data, error: err } = await supabase.auth.signInWithPassword({
			email: body.email as string,
			password: body.password as string,
		});

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          error: 'Invalid credentials'
        })
      }

      return fail(500, {
        error: 'Server error. Try again later.'
      })
    }

    throw redirect(303, '/')
  },
};