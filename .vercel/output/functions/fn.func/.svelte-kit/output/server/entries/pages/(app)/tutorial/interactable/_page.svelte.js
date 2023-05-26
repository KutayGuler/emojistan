import { c as create_ssr_component, b as escape, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve, I as Interactable } from "../../../../../chunks/store.js";
import { w as INTERACTABLE_W, x as INTERACTABLE_H, y as INTERACTABLE_BG, I as INTERACTABLE_BORDER } from "../../../../../chunks/constants.js";
import { T as Tutorial } from "../../../../../chunks/Tutorial.js";
import { I as Interactable_1 } from "../../../../../chunks/Rulebox.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const tutorialProps = [
    {
      header: "Interactable",
      description: "Interactables are very similar to Controllables except they cannot be controlled and have two distinct qualities. They can be talked to and they can drop Effectors once they are destroyed.",
      component: Interactable_1,
      rbx: {
        id: "3",
        type: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER
      },
      props: { id: "3", emoji: "service-dog" },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([["0_5", "woman-walking"], ["0_6", "service-dog"]])),
        controllables: /* @__PURE__ */ new Map([
          [
            "0",
            new Controllable("woman-walking", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        interactables: /* @__PURE__ */ new Map([
          [
            "3",
            new Interactable("service-dog", "-1", 1, [["any", "talk", "none"]], new Evolve("", 0), new Devolve(""), ["-9", 0])
          ]
        ]),
        dt: /* @__PURE__ */ new Map([["1", ["bark!"]], ["3", ["woof."]]]),
        mapClass: "simulation",
        SIZE: 4
      }
    },
    {
      header: "Interactable",
      description: "Interactables are very similar to Controllables except they cannot be controlled and have two distinct qualities. They can be talked to and they can drop Effectors once they are destroyed.",
      component: Interactable_1,
      rbx: {
        id: "5",
        type: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER
      },
      props: {
        id: "5",
        emoji: "evergreen-tree",
        hp: 3,
        sideEffects: [["any", 0, "none"]],
        pseudoSideEffects: [["axe", -1]],
        // @ts-expect-error
        drops: ["wood", 2]
      },
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
            "5",
            new Interactable("evergreen-tree", "-1", 3, [["any", 0, "none"], ["2", -1, "none"]], new Evolve("", 0), new Devolve(""), ["6", 2])
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          ["2", { emoji: "axe", hp: 9, type: "equippable" }],
          ["6", { emoji: "wood", hp: 1, type: "equippable" }]
        ]),
        mapClass: "simulation",
        SIZE: 4
      }
    }
  ];
  let index = 0;
  let props = tutorialProps[index];
  props = tutorialProps[index];
  return `${$$result.head += `<!-- HEAD_svelte-1noo811_START -->${$$result.title = `<title>Emojistan | Tutorial - Interactable</title>`, ""}<!-- HEAD_svelte-1noo811_END -->`, ""}

<div style="display: contents; --header:${escape(INTERACTABLE_BORDER, true)};">${validate_component(Tutorial, "Tutorial").$$render($$result, Object.assign({}, props), {}, {})}</div>

<div class="absolute bottom-4 right-4 flex items-center justify-center gap-2"><p class="absolute -top-8 w-full">${escape(index + 1)} / ${escape(tutorialProps.length)}</p>
	${``}
	${index < tutorialProps.length - 1 ? `<button class="btn-lg btn">⮞</button>` : `${index === tutorialProps.length - 1 ? `<a href="/tutorial/editor" class="btn-lg btn">EDITOR ⮞</a>` : ``}`}</div>`;
});
export {
  Page as default
};
