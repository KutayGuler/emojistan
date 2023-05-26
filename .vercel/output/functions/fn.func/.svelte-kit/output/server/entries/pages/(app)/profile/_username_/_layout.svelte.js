import { c as create_ssr_component, a as subscribe, d as add_attribute, b as escape, e as each } from "../../../../../chunks/index3.js";
import "../../../../../chunks/notifications.js";
import { p as page } from "../../../../../chunks/stores.js";
import "../../../../../chunks/singletons.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tabs;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { data } = $$props;
  let username = "";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  tabs = [
    {
      title: "Games",
      count: data?.games?.count || 0
    },
    {
      title: "Likes",
      count: data?.likes?.count || 0
    },
    {
      title: "Followers",
      count: data?.follower?.count || 0
    },
    {
      title: "Following",
      count: data?.following?.count || 0
    }
  ];
  $$unsubscribe_page();
  return `${data.profileNotCreated ? `${data.isOwner ? `<h2>You don&#39;t have a username. Enter a username to make your profile public.
		</h2>
		${`<form><input required type="text" class="input-bordered input mt-4"${add_attribute("value", username, 0)}>
				<button type="submit" class="btn-primary btn">ENTER</button></form>`}` : `<div class="flex h-full w-full flex-col items-center justify-center gap-12"><i class="twa twa-face-in-clouds scale-150 text-9xl"></i>
			<h2>${escape($page.params.username)} is not here</h2></div>`}` : `<div class="flex h-full flex-col gap-4"><div class="flex flex-row items-center justify-start gap-4"><div class="placeholder avatar"><div class="w-12 rounded-full bg-neutral text-neutral-content"><i class="twa twa-alien text-2xl"></i></div></div>
			<h1 class="text-4xl">${escape($page.params.username)}</h1>
			${!data.isOwner ? `<button class="${"btn-sm btn " + escape(data.youFollow ? "btn-primary" : "", true)}">${escape(data.youFollow ? "FOLLOWING" : "FOLLOW")}</button>
				${data.followsYou ? `<div class="badge badge-sm p-2">Follows You</div>` : ``}` : ``}</div>
		<div class="tabs tabs-boxed z-10 w-full"><a href="${"/profile/" + escape($page.params.username, true)}" class="${"tab " + escape($page.route.id?.at(-1) == "]" ? "brutal tab-active" : "", true)}">Bio</a>
			${each(tabs, ({ title, count }) => {
    let href = title.toLowerCase(), selected = href != "" && $page.route.id?.includes(href);
    return `
				
				<a href="${"/profile/" + escape($page.params.username, true) + "/" + escape(href, true)}" class="${"tab " + escape(selected ? "brutal tab-active" : "", true)}">${escape(title)}
					${escape(count)}
				</a>`;
  })}</div>
		<div class="brutal flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded bg-neutral p-4 text-neutral-content">${slots.default ? slots.default({}) : ``}</div></div>`}`;
});
export {
  Layout as default
};
