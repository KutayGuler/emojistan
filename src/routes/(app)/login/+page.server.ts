import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// @ts-expect-error
export async function load({ locals: { getSession }, depends }): PageServerLoad {
	depends('supabase:auth');

  const session = await getSession();

  if (session) {
    throw redirect(302, "/");
  }
}