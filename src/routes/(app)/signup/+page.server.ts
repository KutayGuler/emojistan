import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// @ts-expect-error
export async function load({ locals: { getSession } }): PageServerLoad {
  const session = await getSession();

  // TODO: huntabyt

  if (session) {
    throw redirect(302, "/");
  }
}