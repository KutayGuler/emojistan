import { c as create_ssr_component, a as subscribe, e as each, b as escape, v as validate_component, d as add_attribute, f as add_styles } from "../../../chunks/index3.js";
import { p as page, n as navigating } from "../../../chunks/stores.js";
import { B as Background } from "../../../chunks/Background.js";
import { P as PUSHER_BORDER, M as MERGER_BORDER, E as EFFECTOR_BORDER, a as CONTROLLABLE_BORDER, I as INTERACTABLE_BORDER, C as CROSS } from "../../../chunks/constants.js";
import "../../../chunks/notifications.js";
import "devalue";
import "../../../chunks/singletons.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "aside.svelte-1m3k6zk{min-width:384px}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  let { data } = $$props;
  const tutorialLinks = [
    {
      href: "/tutorial/controls",
      background: "#cfcfcf"
    },
    {
      href: "/tutorial/ruleboxes",
      background: ""
    },
    {
      href: "/tutorial/pusher",
      background: PUSHER_BORDER
    },
    {
      href: "/tutorial/merger",
      background: MERGER_BORDER
    },
    {
      href: "/tutorial/effector",
      background: EFFECTOR_BORDER
    },
    {
      href: "/tutorial/controllable",
      background: CONTROLLABLE_BORDER
    },
    {
      href: "/tutorial/interactable",
      background: INTERACTABLE_BORDER
    },
    {
      href: "/tutorial/editor",
      background: "#ea5234"
    }
  ];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  $$unsubscribe_page();
  $$unsubscribe_navigating();
  return `<main class="relative flex h-screen w-screen items-start justify-start gap-4 p-4"><aside class="aside z-10 flex h-full w-96 flex-col gap-2 overflow-y-auto bg-neutral bg-opacity-95 shadow-xl svelte-1m3k6zk">${$page.route.id?.includes("tutorial") ? `<a class="btn" href="/"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"></path></svg></a>
			${each(tutorialLinks, ({ href, background }) => {
    let loading = $navigating?.to?.url.pathname == href, isRulebox = href.includes("rule") && $page.url.pathname.includes("rule");
    return `
				
				<a${add_attribute("href", href, 0)} class="${["btn " + escape(isRulebox ? "glass" : "", true), loading ? "loading" : ""].join(" ").trim()}"${add_styles({
      "background": href == $page.url.pathname ? background : ""
    })}>${escape(href.replace("/tutorial/", ""))}</a>`;
  })}
			<p class="text-warning">Tutorial is not up to date! New documentation will come soon.
			</p>` : `<a href="/saves" class="${"btn-primary btn w-full " + escape(
    $navigating?.to?.url.pathname.includes("saves") ? "loading" : "",
    true
  )}">PLAY</a>
			<a href="/tutorial/controls" class="${"btn-secondary btn " + escape(
    $navigating?.to?.url.pathname.includes("tut") ? "loading" : "",
    true
  )}">TUTORIAL</a>
			<a href="/discover" class="${"btn-accent btn " + escape(
    $navigating?.to?.url.pathname.includes("disc") ? "loading" : "",
    true
  )}">DISCOVER</a>`}

		<div class="flex flex-grow"></div>
		${data.session ? `<div class="flex items-end justify-between"><form action="/logout" method="POST"><button type="submit" class="flex flex-row text-sm text-black"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"></path></svg>
						  ${escape("Logout")}</button></form>
				<a href="${"/profile/" + escape(data.username || data.session.user.id, true)}" class="${"avatar self-end " + escape(
    $navigating?.to?.url.pathname.includes("profile") ? "" : "",
    true
  )}"><i class="twa twa-alien text-4xl"></i></a></div>` : `<div class="flex w-full flex-col items-end gap-2 text-neutral-content"><a href="/login" class="btn-ghost btn-xs btn w-fit">Login</a>
				<a href="/signup" class="btn-ghost btn-xs btn w-fit">Sign Up</a></div>`}
		<div class="absolute bottom-0 left-1 text-xs text-base-300">Emojistan v0.0.1
		</div></aside>
	${$page.route.id == "/(app)" ? `${slots.default ? slots.default({}) : ``}` : `<div class="${"brutal z-10 h-full w-full rounded " + escape(
    ["/signup", "/login"].includes($page.url.pathname) ? "bg-neutral" : "bg-base-200",
    true
  ) + " bg-opacity-95 p-8"}"><a href="/" class="btn-ghost btn absolute right-4 top-4 border-none text-2xl hover:border-none">${escape(CROSS)}</a>
			${slots.default ? slots.default({}) : ``}</div>`}</main>
${validate_component(Background, "Background").$$render($$result, {}, {}, {})}`;
});
export {
  Layout as default
};
