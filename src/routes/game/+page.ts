import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { browser } from "$app/environment";

export const load: PageLoad = () => {
  // console.log(browser);
  // return;
  // if (localStorage.getItem("currentSave") == "") {
  //   throw redirect(307, "/");
  // }
};
