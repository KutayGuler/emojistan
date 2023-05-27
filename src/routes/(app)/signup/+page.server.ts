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
  signup: async ({ request, locals: { supabase } }) => {
    const body = Object.fromEntries(await request.formData())

    if (body.password != body.passwordConfirm) {
      return fail(400, {
        error: 'Passwords are not matching.'
      })
    }

    const { data, error: err } = await supabase.auth.signUp({
      email: body.email as string,
      password: body.password as string
    })

    if (err) {
      if (err instanceof AuthApiError && err.status == 400) {
        return fail(400, {
          error: 'Invalid email or password'
        })
      }

      return fail(500, {
        error: 'Server error. Please try again later.'
      })
    }
  }
};