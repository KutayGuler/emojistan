import { c as create_ssr_component, a as subscribe, d as add_attribute, b as escape, e as each } from "./index3.js";
import { p as page } from "./stores.js";
import { l as liked_game_ids } from "./store.js";
const GameCard_svelte_svelte_type_style_lang = "";
const css = {
  code: "#card.svelte-kmqnqb{min-height:224px}",
  map: null
};
const GameCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $liked_game_ids, $$unsubscribe_liked_game_ids;
  let $page, $$unsubscribe_page;
  $$unsubscribe_liked_game_ids = subscribe(liked_game_ids, (value) => $liked_game_ids = value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let { index = 0 } = $$props;
  let { id } = $$props;
  let { name } = $$props;
  let { profile } = $$props;
  let { emojis = /* @__PURE__ */ new Set() } = $$props;
  let { div = null } = $$props;
  let liked = $liked_game_ids.has(id);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.profile === void 0 && $$bindings.profile && profile !== void 0)
    $$bindings.profile(profile);
  if ($$props.emojis === void 0 && $$bindings.emojis && emojis !== void 0)
    $$bindings.emojis(emojis);
  if ($$props.div === void 0 && $$bindings.div && div !== void 0)
    $$bindings.div(div);
  $$result.css.add(css);
  $$unsubscribe_liked_game_ids();
  $$unsubscribe_page();
  return `<div id="card" class="brutal relative mb-2 flex flex-col rounded-lg bg-slate-300 p-4 text-neutral svelte-kmqnqb"${add_attribute("this", div, 0)}><h3>${escape(name)}</h3>
	<p class="text-md text-slate-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
		doloribus unde quae? Soluta vel deserunt ipsam aliquam amet esse officia
		impedit, illum est, vitae placeat?
	</p>
	<div class="flex flex-row gap-2">${each([...emojis.keys()], (emoji) => {
    return `<i class="${"twa text-4xl twa-" + escape(emoji, true)}"></i>`;
  })}</div>
	<div class="flex flex-grow"></div>
	<div class="flex flex-row justify-between">${profile ? `<a href="${"/profile/" + escape(profile.username, true)}" class="btn-ghost btn-sm btn flex gap-2 rounded-l-full border-none pl-0 hover:border-none"><div class="placeholder avatar"><div class="w-8 rounded-full bg-neutral text-neutral-content"><i class="twa twa-alien text-lg"></i></div></div>
				<div>${escape(profile.username)}</div></a>` : ``}
		<div class="flex items-center gap-2">${$page.data.session ? `<button><svg xmlns="http://www.w3.org/2000/svg"${add_attribute("fill", liked ? "red" : "none", 0)} viewBox="0 0 24 24" stroke-width="1.5"${add_attribute("stroke", liked ? "none" : "currentColor", 0)} class="h-8 w-8"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path></svg></button>` : ``}
			<a href="${"/games/" + escape(id, true)}" class="btn-sm btn self-end">PLAY</a></div></div>
</div>`;
});
export {
  GameCard as G
};
