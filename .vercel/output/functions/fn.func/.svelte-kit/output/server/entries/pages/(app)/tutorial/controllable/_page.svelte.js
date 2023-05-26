import { c as create_ssr_component, b as escape, v as validate_component } from "../../../../../chunks/index3.js";
import { E as EditableMap, C as Controllable, a as Evolve, D as Devolve } from "../../../../../chunks/store.js";
import { b as CONTROLLABLE_W, c as CONTROLLABLE_H, d as CONTROLLABLE_BG, a as CONTROLLABLE_BORDER } from "../../../../../chunks/constants.js";
import { T as Tutorial } from "../../../../../chunks/Tutorial.js";
import { C as Controllable_1 } from "../../../../../chunks/Rulebox.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const tutorialProps = [
    {
      veilHeight: 520,
      veilColor: "bg-green-50",
      header: "Controllable",
      description: "Controllables, as the name suggests, are the emojis that can be controlled by the player. At least one Controllable is required in the map for your game to be playable.",
      component: Controllable_1,
      rbx: {
        id: "0",
        type: "controllable",
        position: { x: 0, y: 0 },
        width: CONTROLLABLE_W,
        height: CONTROLLABLE_H,
        bgColor: CONTROLLABLE_BG,
        borderColor: CONTROLLABLE_BORDER
      },
      props: { id: "0", emoji: "baby" },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([["0_0", "baby"]])),
        controllables: /* @__PURE__ */ new Map([
          [
            "1",
            new Controllable("baby", 1, [["any", 0]], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        mapClass: "simulation",
        SIZE: 4
      }
    },
    {
      header: "Controllable",
      description: "A Controllable has emoji and hp slots for Devolve, Default and Evolve. Controllables can evolve or devolve based on their current HP. <br><br> Side Effects will affect their HP and those Side Effects should be chosen from Effectors.",
      component: Controllable_1,
      rbx: {
        id: "4",
        type: "controllable",
        position: { x: 0, y: 0 },
        width: CONTROLLABLE_W,
        height: CONTROLLABLE_H,
        bgColor: CONTROLLABLE_BG,
        borderColor: CONTROLLABLE_BORDER
      },
      props: {
        id: "4",
        emoji: "baby",
        evolve: new Evolve("woman-walking", 5),
        // @ts-expect-error
        pseudoSideEffects: [["baby-bottle", 1]]
      },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([
          ["0_0", "baby"],
          ["0_10", "baby-bottle"],
          ["0_11", "baby-bottle"],
          ["0_14", "baby-bottle"],
          ["0_15", "baby-bottle"]
        ])),
        controllables: /* @__PURE__ */ new Map([
          [
            "4",
            new Controllable("baby", 1, [["3", 1]], new Evolve("woman-walking", 5), new Devolve(""))
          ],
          [
            "2",
            new Controllable("woman-walking", 1, [], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          [
            "3",
            {
              emoji: "baby-bottle",
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
      header: "Controllable",
      description: "A Controllable has emoji and hp slots for Devolve, Default and Evolve. Controllables can evolve or devolve based on their current HP. <br><br> Side Effects will affect their HP and those Side Effects should be chosen from Effectors.",
      component: Controllable_1,
      rbx: {
        id: "5",
        type: "controllable",
        position: { x: 0, y: 0 },
        width: CONTROLLABLE_W,
        height: CONTROLLABLE_H,
        bgColor: CONTROLLABLE_BG,
        borderColor: CONTROLLABLE_BORDER
      },
      props: {
        id: "5",
        emoji: "monkey",
        devolve: new Devolve("pig"),
        // @ts-expect-error
        pseudoSideEffects: [["test-tube", -1]]
      },
      gameProps: {
        map: new EditableMap(/* @__PURE__ */ new Map([["0_0", "monkey"], ["0_10", "test-tube"]])),
        controllables: /* @__PURE__ */ new Map([
          [
            "5",
            new Controllable("monkey", 1, [["3", -1]], new Evolve("", 0), new Devolve("pig"))
          ],
          [
            "2",
            new Controllable("pig", 1, [], new Evolve("", 0), new Devolve(""))
          ]
        ]),
        effectors: /* @__PURE__ */ new Map([
          [
            "3",
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
    }
  ];
  let index = 0;
  let props = tutorialProps[index];
  props = tutorialProps[index];
  return `<div style="display: contents; --header:${escape(CONTROLLABLE_BORDER, true)};">${validate_component(Tutorial, "Tutorial").$$render($$result, Object.assign({}, props), {}, {})}</div>

${$$result.head += `<!-- HEAD_svelte-o08gti_START -->${$$result.title = `<title>Emojistan | Tutorial - Controllable</title>`, ""}<!-- HEAD_svelte-o08gti_END -->`, ""}

<div class="absolute bottom-4 right-4 flex items-center justify-center gap-2"><p class="absolute -top-8 w-full">${escape(index + 1)} / ${escape(tutorialProps.length)}</p>
	${``}
	${index < tutorialProps.length - 1 ? `<button class="btn-lg btn">⮞</button>` : `${index === tutorialProps.length - 1 ? `<a href="/tutorial/interactable" class="btn-lg btn">INTERACTABLE ⮞</a>` : ``}`}</div>`;
});
export {
  Page as default
};
