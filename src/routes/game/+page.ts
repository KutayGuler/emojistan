import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";

export const load: PageLoad = () => {
  // if (browser) {
  //   let save = localStorage.getItem("currentSave");
  //   if (save == null || save == "") {
  //     throw redirect(300, "/");
  //   }
  // }
};
