import { c as create_ssr_component, a as subscribe, e as each, b as escape } from "../../../../chunks/index3.js";
import { p as page } from "../../../../chunks/stores.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const tabs = ["New", "Following", "Search"];
  $$unsubscribe_page();
  return `<div class="flex h-full flex-col"><h1 class="text-6xl text-accent">Discover</h1>
	<div class="tabs tabs-boxed py-3">${each(tabs, (_tab) => {
    let tab = _tab.toLowerCase();
    return `
			<a href="${"/discover/" + escape(tab, true)}" class="${"tab " + escape(
      $page.route.id?.includes(tab) ? "brutal bg-accent text-accent-content" : "",
      true
    )}">${escape(_tab)}</a>`;
  })}</div>

	${slots.default ? slots.default({}) : ``}</div>`;
});
export {
  Layout as default
};
