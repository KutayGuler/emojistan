import { c as create_ssr_component, b as escape, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve, I as Interactable } from "../../../../../chunks/store.js";
import { e as EFFECTOR_W, f as EFFECTOR_H, g as EFFECTOR_BG, E as EFFECTOR_BORDER } from "../../../../../chunks/constants.js";
import { T as Tutorial } from "../../../../../chunks/Tutorial.js";
import { E as Effector_1 } from "../../../../../chunks/Rulebox.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const tutorialProps = [
    {
      header: "Effector",
      description: 'Effector takes an emoji and a number input. Emoji is the effector itself and the number below it is the number of times it can be used before it disappears. It can be a number between 1 and 100 or "Infinite".',
      component: Effector_1,
      rbx: {
        id: "0",
        type: "effector",
        position: { x: 0, y: 0 },
        width: EFFECTOR_W,
        height: EFFECTOR_H,
        bgColor: EFFECTOR_BG,
        borderColor: EFFECTOR_BORDER
      },
      props: { id: "0", emoji: "test-tube" },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "woman-walking"], ["0_6", "test-tube"]])),
        controllables: /* @__PURE__ */ new Map([
          [
            "1",
            new Controllable("woman-walking", 1, [["0", -1]], new Evolve("", 0), new Devolve("skull"))
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          [
            "0",
            {
              emoji: "test-tube",
              hp: 1,
              type: "equippable"
            }
          ]
        ]),
        mapClass: "simulation",
        SIZE: 4
      }
    },
    {
      description: "Just like in real life, the effect of the Effector depends on who used it.",
      component: Effector_1,
      rbx: {
        id: "2",
        type: "effector",
        position: { x: 0, y: 0 },
        width: EFFECTOR_W,
        height: EFFECTOR_H,
        bgColor: EFFECTOR_BG,
        borderColor: EFFECTOR_BORDER
      },
      props: { id: "2", emoji: "test-tube" },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "monkey"], ["0_6", "test-tube"]])),
        controllables: /* @__PURE__ */ new Map([
          [
            "1",
            new Controllable("monkey", 1, [["2", 1]], new Evolve("pig", 2), new Devolve(""))
          ],
          [
            "3",
            new Controllable("pig", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          [
            "2",
            {
              emoji: "test-tube",
              hp: 1,
              type: "equippable"
            }
          ]
        ]),
        mapClass: "simulation",
        SIZE: 4
      }
    },
    {
      description: "Effectors can also be used on the entities other than the player.",
      component: Effector_1,
      rbx: {
        id: "2",
        type: "effector",
        position: { x: 0, y: 0 },
        width: EFFECTOR_W,
        height: EFFECTOR_H,
        bgColor: EFFECTOR_BG,
        borderColor: EFFECTOR_BORDER
      },
      props: { id: "2", emoji: "axe" },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([
          ["0_5", "woman-walking"],
          ["0_6", "axe"],
          ["0_11", "evergreen-tree"],
          ["0_14", "evergreen-tree"],
          ["0_15", "evergreen-tree"]
        ])),
        controllables: /* @__PURE__ */ new Map([
          [
            "1",
            new Controllable("woman-walking", 1, [], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        interactables: /* @__PURE__ */ new Map([
          [
            "-1",
            new Interactable("evergreen-tree", "-1", 3, [["2", -1, "none"]], new Evolve("", 0), new Devolve(""), ["3", 2])
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          ["2", { emoji: "axe", hp: 9, type: "equippable" }],
          ["3", { emoji: "wood", hp: 1, type: "equippable" }]
        ]),
        mapClass: "simulation",
        SIZE: 4
      }
    }
  ];
  let index = 0;
  let props = tutorialProps[index];
  props = tutorialProps[index];
  return `${$$result.head += `<!-- HEAD_svelte-6glrt7_START -->${$$result.title = `<title>Emojistan | Tutorial - Effector</title>`, ""}<!-- HEAD_svelte-6glrt7_END -->`, ""}

<div style="display: contents; --header:${escape(EFFECTOR_BORDER, true)};">${validate_component(Tutorial, "Tutorial").$$render($$result, Object.assign({}, props), {}, {})}</div>

<div class="absolute bottom-4 right-4 flex items-center justify-center gap-2"><p class="absolute -top-8 w-full">${escape(index + 1)} / ${escape(tutorialProps.length)}</p>
	${``}
	${index < tutorialProps.length - 1 ? `<button class="btn-lg btn">⮞</button>` : `${index === tutorialProps.length - 1 ? `<a href="/tutorial/controllable" class="btn-lg btn">CONTROLLABLE ⮞</a>` : ``}`}</div>`;
});
export {
  Page as default
};
