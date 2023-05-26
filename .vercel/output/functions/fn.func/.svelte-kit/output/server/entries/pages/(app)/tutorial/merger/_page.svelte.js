import { c as create_ssr_component, b as escape, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve } from "../../../../../chunks/store.js";
import { l as MERGER_W, m as MERGER_H, n as MERGER_BG, M as MERGER_BORDER } from "../../../../../chunks/constants.js";
import { T as Tutorial } from "../../../../../chunks/Tutorial.js";
import { M as Merger } from "../../../../../chunks/Rulebox.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const tutorialProps = {
    header: "Merger",
    component: Merger,
    rbx: {
      id: "-1",
      type: "merger",
      position: { x: 0, y: 0 },
      width: MERGER_W,
      height: MERGER_H,
      bgColor: MERGER_BG,
      borderColor: MERGER_BORDER
    },
    props: {
      id: "-1",
      slots: ["cloud", "snowflake", "cloud-with-snow"]
    },
    gameProps: {
      map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "cloud"], ["0_6", "snowflake"]])),
      controllables: /* @__PURE__ */ new Map([
        [
          "0",
          new Controllable("cloud", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
        ],
        [
          "1",
          new Controllable("snowflake", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
        ],
        [
          "2",
          new Controllable("cloud-with-snow", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
        ]
      ]),
      mergers: /* @__PURE__ */ new Map([["4", ["cloud", "snowflake", "cloud-with-snow"]]]),
      mapClass: "simulation",
      SIZE: 4,
      showHP: false,
      showInventory: false
    }
  };
  return `${$$result.head += `<!-- HEAD_svelte-pu8bwd_START -->${$$result.title = `<title>Emojistan | Tutorial - Merger</title>`, ""}<!-- HEAD_svelte-pu8bwd_END -->`, ""}

<div style="display: contents; --header:${escape(MERGER_BORDER, true)};">${validate_component(Tutorial, "Tutorial").$$render($$result, Object.assign({}, tutorialProps), {}, {
    description: () => {
      return `<div slot="description">Merger takes three emoji inputs. To put it simply,
		<div class="w-fit rounded bg-neutral p-2 text-neutral-content"><i class="twa twa-cloud text-2xl"></i>
			+
			<i class="twa twa-snowflake text-2xl"></i> =
			<i class="twa twa-cloud-with-snow text-2xl"></i></div>
		<br>
		Alternatively,
		<div class="w-fit rounded bg-neutral p-2 text-neutral-content"><i class="twa twa-cloud text-2xl"></i>
			+
			<i class="twa twa-snowflake text-2xl"></i>
			= <i class="twa twa-cloud-with-snow text-2xl"></i></div></div>`;
    }
  })}</div>`;
});
export {
  Page as default
};
