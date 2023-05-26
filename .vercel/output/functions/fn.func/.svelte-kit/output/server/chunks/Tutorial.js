import { c as create_ssr_component, b as escape, v as validate_component, f as add_styles } from "./index3.js";
import { R as Rulebox } from "./Rulebox.js";
import { G as Game } from "./Game.js";
const Tutorial_svelte_svelte_type_style_lang = "";
const css = {
  code: "h1.svelte-1dz9xhq.svelte-1dz9xhq{color:var(--header)}#rbx.svelte-1dz9xhq>.svelte-1dz9xhq{pointer-events:none}",
  map: null
};
const Tutorial = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { header = "" } = $$props;
  let { description = "" } = $$props;
  let { rbx } = $$props;
  let { props } = $$props;
  let { gameProps } = $$props;
  let { veilHeight = 0 } = $$props;
  let { veilColor = "bg-indigo-50" } = $$props;
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0)
    $$bindings.description(description);
  if ($$props.rbx === void 0 && $$bindings.rbx && rbx !== void 0)
    $$bindings.rbx(rbx);
  if ($$props.props === void 0 && $$bindings.props && props !== void 0)
    $$bindings.props(props);
  if ($$props.gameProps === void 0 && $$bindings.gameProps && gameProps !== void 0)
    $$bindings.gameProps(gameProps);
  if ($$props.veilHeight === void 0 && $$bindings.veilHeight && veilHeight !== void 0)
    $$bindings.veilHeight(veilHeight);
  if ($$props.veilColor === void 0 && $$bindings.veilColor && veilColor !== void 0)
    $$bindings.veilColor(veilColor);
  $$result.css.add(css);
  return `<div class="relative flex h-full w-full flex-row items-start justify-start gap-4"><div class="relative flex w-1/2 flex-col items-center justify-center"><div class="self-start">${header ? `<h1 class="text-6xl svelte-1dz9xhq">${escape(header)}</h1>` : ``}
			<div class="pb-4 pt-2">${slots.description ? slots.description({}) : `
					<!-- HTML_TAG_START -->${description}<!-- HTML_TAG_END -->
				`}</div></div>
		<div aria-hidden="true" id="rbx" style="${"width: " + escape(rbx.width, true) + "px; height: " + escape(rbx.height, true) + "px;"}" class="pointer-events-none relative mb-24 mt-12 flex flex-col justify-center svelte-1dz9xhq">${validate_component(Rulebox, "Rulebox").$$render($$result, { rbx, props }, {}, {})}
				<div class="${"absolute bottom-0 z-10 " + escape(veilColor, true) + " svelte-1dz9xhq"}"${add_styles({ "height": veilHeight + "px" })}></div></div></div>
	<div class="relative flex w-1/2 flex-col items-center justify-center self-center">${validate_component(Game, "Game").$$render($$result, Object.assign({}, gameProps), {}, {})}</div>
</div>`;
});
export {
  Tutorial as T
};
