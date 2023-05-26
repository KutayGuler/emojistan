import { c as create_ssr_component, b as escape, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve } from "../../../../../chunks/store.js";
import { o as PUSHER_W, q as PUSHER_H, r as PUSHER_BG, P as PUSHER_BORDER } from "../../../../../chunks/constants.js";
import { T as Tutorial } from "../../../../../chunks/Tutorial.js";
import { P as Pusher } from "../../../../../chunks/Rulebox.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const tutorialProps = {
    header: "Pusher",
    description: 'Pusher takes two emoji inputs and makes <i class="twa twa-leaf-fluttering-in-wind text-2xl"></i> pushable by <i class="twa twa-wind-face text-2xl"></i> ',
    component: Pusher,
    rbx: {
      id: "0",
      type: "pusher",
      position: { x: 0, y: 0 },
      width: PUSHER_W,
      height: PUSHER_H,
      bgColor: PUSHER_BG,
      borderColor: PUSHER_BORDER
    },
    props: {
      id: "-1",
      slots: ["wind-face", "leaf-fluttering-in-wind", "push"]
    },
    gameProps: {
      map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "wind-face"], ["0_6", "leaf-fluttering-in-wind"]])),
      controllables: /* @__PURE__ */ new Map([
        [
          "0",
          new Controllable("wind-face", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
        ]
      ]),
      pushers: /* @__PURE__ */ new Map([["0", ["wind-face", "leaf-fluttering-in-wind", "push"]]]),
      mapClass: "simulation",
      SIZE: 4,
      showHP: false,
      showInventory: false
    }
  };
  return `${$$result.head += `<!-- HEAD_svelte-ggnwvu_START -->${$$result.title = `<title>Emojistan | Tutorial - Pusher</title>`, ""}<!-- HEAD_svelte-ggnwvu_END -->`, ""}

<div style="display: contents; --header:${escape(PUSHER_BORDER, true)};">${validate_component(Tutorial, "Tutorial").$$render($$result, Object.assign({}, tutorialProps), {}, {})}</div>`;
});
export {
  Page as default
};
