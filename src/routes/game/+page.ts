import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = () => {
  //   if (localStorage.getItem("currentSave") == "") {
  //     throw redirect(307, "/");
  //   }
};
