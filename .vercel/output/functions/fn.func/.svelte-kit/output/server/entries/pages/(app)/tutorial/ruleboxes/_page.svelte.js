import { c as create_ssr_component, o as onDestroy, e as each, b as escape, v as validate_component, m as missing_component } from "../../../../../chunks/index3.js";
import { R as Rulebox, P as Pusher, M as Merger, E as Effector_1, C as Controllable_1, I as Interactable_1 } from "../../../../../chunks/Rulebox.js";
import { o as PUSHER_W, q as PUSHER_H, r as PUSHER_BG, P as PUSHER_BORDER, l as MERGER_W, m as MERGER_H, n as MERGER_BG, M as MERGER_BORDER, e as EFFECTOR_W, f as EFFECTOR_H, g as EFFECTOR_BG, E as EFFECTOR_BORDER, b as CONTROLLABLE_W, c as CONTROLLABLE_H, d as CONTROLLABLE_BG, a as CONTROLLABLE_BORDER, w as INTERACTABLE_W, x as INTERACTABLE_H, y as INTERACTABLE_BG, I as INTERACTABLE_BORDER } from "../../../../../chunks/constants.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const ruleboxes = [
    {
      component: Pusher,
      rbx: {
        id: "0",
        type: "pusher",
        position: { x: 0, y: 0 },
        width: PUSHER_W,
        height: PUSHER_H,
        bgColor: PUSHER_BG,
        borderColor: PUSHER_BORDER
      }
    },
    {
      component: Merger,
      rbx: {
        id: "0",
        type: "merger",
        position: { x: 0, y: 0 },
        width: MERGER_W,
        height: MERGER_H,
        bgColor: MERGER_BG,
        borderColor: MERGER_BORDER
      }
    },
    {
      component: Effector_1,
      rbx: {
        id: "0",
        type: "effector",
        position: { x: 0, y: 0 },
        width: EFFECTOR_W,
        height: EFFECTOR_H,
        bgColor: EFFECTOR_BG,
        borderColor: EFFECTOR_BORDER
      }
    },
    {
      component: Controllable_1,
      rbx: {
        id: "-1",
        type: "controllable",
        position: { x: 0, y: 0 },
        width: CONTROLLABLE_W,
        height: CONTROLLABLE_H,
        bgColor: CONTROLLABLE_BG,
        borderColor: CONTROLLABLE_BORDER
      }
    },
    {
      component: Interactable_1,
      rbx: {
        id: "0",
        type: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER
      }
    }
  ];
  let index = 0;
  let interval = setInterval(
    () => {
      index += 1;
      if (index >= 5) {
        index = 0;
      }
    },
    1500
  );
  onDestroy(() => {
    clearInterval(interval);
  });
  return `${$$result.head += `<!-- HEAD_svelte-gy1y6o_START -->${$$result.title = `<title>Emojistan | Tutorial - Ruleboxes</title>`, ""}<!-- HEAD_svelte-gy1y6o_END -->`, ""}

<div class="self-start"><h1 class="text-6xl">Ruleboxes</h1>
	<p class="w-1/2 pt-2">Ruleboxes are the fundamental elements that build the game logic. In the
		following tutorials, you will learn about each of those Ruleboxes.
	</p></div>

<div class="relative flex h-full flex-col items-center justify-center pb-4">${each(ruleboxes, ({ rbx, component }, i) => {
    return `${index === i ? `<div style="${"width: " + escape(rbx.width, true) + "px; height: " + escape(rbx.height, true) + "px;"}" class="pointer-events-none relative flex flex-col justify-center">${validate_component(Rulebox, "Rulebox").$$render($$result, { rbx }, {}, {
      default: () => {
        return `${validate_component(component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}
				`;
      }
    })}
			</div>` : ``}`;
  })}</div>`;
});
export {
  Page as default
};
