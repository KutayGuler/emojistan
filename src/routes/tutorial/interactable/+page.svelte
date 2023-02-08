<script lang="ts">
  import {
    Interactable as TInteractable,
    Equippable,
    EditableMap,
    Evolve,
    Devolve,
    SequenceItem,
    Consumable,
  } from "$src/types";
  import {
    INTERACTABLE_BG,
    INTERACTABLE_BORDER,
    INTERACTABLE_H,
    INTERACTABLE_W,
  } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Interactable from "$components/Interactable.svelte";

  // TODO: Figure out how to display side effects other than "any"
  const incremental = [464, 440, 400, 164, 0];
  let index = 0;

  const tutorialProps = [
    {
      header: "Interactable",
      description:
        "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
      component: Interactable,
      node: {
        id: 0,
        component: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER,
      },
      props: {
        id: -1,
        emoji: "🌵",
        isStatic: true,
      },
      gameProps: {
        map: new EditableMap(
          new Map<number, string>([
            [5, "👶"],
            [3, "🌵"],
            [6, "🌵"],
            [9, "🌵"],
            [12, "🌵"],
            [7, "👶"],
          ])
        ),
        statics: new Set<string>(["🌵"]),
        interactables: new Map<number, TInteractable>([
          [
            -1,
            new TInteractable(
              "🌵",
              [],
              1,
              1,
              [["any", 0]],
              true,
              new Evolve(false, "", 2),
              new Devolve(false, "")
            ),
          ],
        ]),

        mapClass: "simulation",
        SIZE: 4,
      },
    },
    // EVOLUTION (monkey with banana, eats 4 bananas, evolves to human)
    {
      header: "Interactable",
      description:
        "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
      component: Interactable,
      node: {
        id: 0,
        component: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER,
      },
      props: {
        id: -1,
        emoji: "👶",
        evolve: new Evolve(true, "🚶", 5),
      },
      gameProps: {
        map: new EditableMap(
          new Map<number, string>([
            [0, "👶"],
            [10, "🍼"],
            [11, "🍼"],
            [14, "🍼"],
            [15, "🍼"],
          ])
        ),
        statics: new Set<string>(["🍼"]),
        consumables: new Map<number, Consumable>([
          [-2, { emoji: "🍼", hp: 1, mutateConsumerTo: "" }],
        ]),
        interactables: new Map<number, TInteractable>([
          [
            -3,
            new TInteractable(
              "👶",
              [],
              1,
              1,
              [],
              true,
              new Evolve(true, "🚶", 5),
              new Devolve(false, "")
            ),
          ],
        ]),

        mapClass: "simulation",
        SIZE: 4,
      },
    },
    //  DEVOLUTION (human eats 4 🧪's devolves to 🧟)
    {
      header: "Interactable",
      description:
        "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
      component: Interactable,
      node: {
        id: 0,
        component: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER,
      },
      props: {
        id: -1,
        emoji: "🚶",
        devolve: new Devolve(true, "🧟"),
        hp: 4,
      },
      gameProps: {
        map: new EditableMap(
          new Map<number, string>([
            [0, "🚶"],
            [10, "🧪"],
            [11, "🧪"],
            [14, "🧪"],
            [15, "🧪"],
          ])
        ),
        statics: new Set<string>(["🧪"]),
        consumables: new Map<number, Consumable>([
          [-2, { emoji: "🧪", hp: -1, mutateConsumerTo: "" }],
        ]),
        interactables: new Map<number, TInteractable>([
          [
            -3,
            new TInteractable(
              "🚶",
              [],
              4,
              1,
              [],
              true,
              new Evolve(false, "", 2),
              new Devolve(true, "🧟")
            ),
          ],
        ]),

        mapClass: "simulation",
        SIZE: 4,
      },
    },

    //SIDE EFFECTS (door and monkey, interacting with "any" will be of no use, will have to use a key)
    {
      header: "Interactable",
      description: "",
      component: Interactable,
      node: {
        id: 0,
        component: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER,
      },
      props: {
        id: -1,
        emoji: "🚪",
        isStatic: true,
      },
      gameProps: {
        map: new EditableMap(
          new Map<number, string>([
            [0, "🐒"],
            [2, "🚪"],
            [6, "🧱"],
            [10, "🧱"],
            [12, "🗝️"],
            [14, "🧱"],
            [15, "🍌"],
          ])
        ),
        statics: new Set<string>(["🧱", "🚪", "🍌"]),
        equippables: new Map<number, Equippable>([
          [-69, new Equippable("🗝️", 1)],
        ]),
        interactables: new Map<number, TInteractable>([
          [
            -1,
            new TInteractable(
              "🚪",
              [],
              1,
              1,
              [
                ["any", 0],
                [-69, -1],
              ],
              true,
              new Evolve(false, "", 2),
              new Devolve(false, "")
            ),
          ],
        ]),
        mapClass: "simulation",
        SIZE: 4,
      },
    },

    // // EVENT SEQUENCE (the level from equippable)
    {
      header: "Interactable",
      description: "",
      component: Interactable,
      node: {
        id: 0,
        component: "interactable",
        position: { x: 0, y: 0 },
        width: INTERACTABLE_W,
        height: INTERACTABLE_H,
        bgColor: INTERACTABLE_BG,
        borderColor: INTERACTABLE_BORDER,
      },
      props: {
        id: -1,
        emoji: "🚪",
        isStatic: true,
      },
      gameProps: {
        map: new EditableMap(
          new Map<number, string>([
            [0, "🐒"],
            [2, "🚪"],
            [6, "🧱"],
            [10, "🧱"],
            [12, "🗝️"],
            [14, "🧱"],
            [15, "🍌"],
          ])
        ),
        statics: new Set<string>(["🧱", "🚪", "🍌"]),
        equippables: new Map<number, Equippable>([
          [-69, new Equippable("🗝️", 1)],
        ]),
        interactables: new Map<number, TInteractable>([
          [
            -1,
            new TInteractable(
              "🚪",
              [],
              1,
              1,
              [
                ["any", 0],
                [-69, -1],
              ],
              true,
              new Evolve(false, "", 2),
              new Devolve(false, "")
            ),
          ],
        ]),
        mapClass: "simulation",
        SIZE: 4,
      },
    },
  ];

  $: props = tutorialProps[index];
  // FIXME: Interactable not rerendering
</script>

{#key index}
  <Tutorial {...props} --header={INTERACTABLE_BORDER} {index} {incremental} />
{/key}

<!-- {#each tutorialProps as props, i}
{/each} -->

<div class="flex">
  <button class="btn" on:click={() => index--}>PREV</button>
  <button class="btn" on:click={() => index++}>NEXT</button>
</div>
