import { c as create_ssr_component, d as add_attribute, b as escape, e as each, v as validate_component } from "../../../../../chunks/index3.js";
import { G as GameCard } from "../../../../../chunks/GameCard.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let query = "";
  let searchResult = [];
  /* @__PURE__ */ new Map();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `<div class="flex flex-row gap-2 pb-2"><form class="relative w-full"><input type="text" class="input-bordered input w-full" required${add_attribute("value", query, 0)}>
		<button class="btn-ghost btn-sm btn absolute right-0.5 h-full border-none hover:border-none"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path></svg></button></form>
	<select class="select-bordered select"><option value="games">Games</option><option value="profiles">Profiles</option></select>
	<i class="${"twa text-4xl twa-" + escape("joystick", true)}"></i></div>
${`${`${searchResult.length > 0 ? `${each(searchResult, (result, index) => {
    return `${`<div class="flex h-fit flex-col overflow-y-auto overflow-x-hidden pr-2">${validate_component(GameCard, "GameCard").$$render($$result, Object.assign({}, { index }, result), {}, {})}
			</div>`}`;
  })}` : ``}`}`}`;
});
export {
  Page as default
};
