import { r as redirect } from "../../../../chunks/index.js";
function load() {
  throw redirect(302, "/discover/new");
}
export {
  load
};
