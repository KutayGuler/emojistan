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

  // TODO: Figure out how to display side effects other than "any"
  // const veilHeights = [464, 440, 400, 164, 0];
  // const veilHeight = 0;
  let index = 0;

  // export let data;
  // console.log(data);

  // TODO: Try resetting props based on previous props

  // const tutorialProps = {
  //   header: "Interactable",
  //   description:
  //     "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
  //   rbx: {
  //     id: 0,
  //     type: "interactable",
  //     position: { x: 0, y: 0 },
  //     width: INTERACTABLE_W,
  //     height: INTERACTABLE_H,
  //     bgColor: INTERACTABLE_BG,
  //     borderColor: INTERACTABLE_BORDER,
  //   },
  //   props: {
  //     id: -1,
  //     emoji: "🌵",
  //     isStatic: true,
  //     evolve: new Evolve(false, "", 2),
  //     devolve: new Devolve(false, ""),
  //     hp: 1,
  //   },
  //   gameProps: {
  //     map: new EditableMap(
  //       new Map<number, string>([
  //         [5, "👶"],
  //         [3, "🌵"],
  //         [6, "🌵"],
  //         [9, "🌵"],
  //         [12, "🌵"],
  //         [7, "👶"],
  //       ])
  //     ),
  //     statics: new Set<string>(["🌵"]),
  //     interactables: new Map<number, TInteractable>([
  //       [
  //         -1,
  //         new TInteractable(
  //           "🌵",
  //           [],
  //           1,
  //           1,
  //           [["any", 0]],
  //           true,
  //           new Evolve(false, "", 2),
  //           new Devolve(false, "")
  //         ),
  //       ],
  //     ]),
  //     mapClass: "simulation",
  //     SIZE: 4,
  //   },
  // };
  const rbx = {
    id: 0,
    type: "interactable",
    position: { x: 0, y: 0 },
    width: INTERACTABLE_W,
    height: INTERACTABLE_H,
    bgColor: INTERACTABLE_BG,
    borderColor: INTERACTABLE_BORDER,
  };

  const tutorialProps = [
    {
      header: "Interactable",
      description:
        "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
      veilHeight: 464,
      props: {
        id: "static",
        emoji: "🌵",
        isStatic: true,
        evolve: new Evolve(false, "", 2),
        devolve: new Devolve(false, ""),
        hp: 1,
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
            "static",
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
      veilHeight: 440,
      props: {
        id: "evolution",
        emoji: "👶",
        isStatic: false,
        evolve: new Evolve(true, "🚶", 5),
        devolve: new Devolve(false, ""),
        hp: 1,
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
          [-1, { emoji: "🍼", hp: 1, mutateConsumerTo: "" }],
        ]),
        interactables: new Map<number, TInteractable>([
          [
            "evolution",
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
      veilHeight: 400,
      props: {
        id: -3,
        emoji: "🚶",
        evolve: new Evolve(false, "", 2),
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
      veilHeight: 164,
      props: {
        id: -4,
        emoji: "🚪",
        isStatic: true,
        evolve: new Evolve(false, "", 2),
        devolve: new Devolve(false, ""),
        hp: 1,
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
            -4,
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
      props: {
        id: -5,
        emoji: "🚪",
        isStatic: true,
        evolve: new Evolve(false, "", 2),
        devolve: new Devolve(false, ""),
        hp: 1,
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
            -5,
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

  let props = tutorialProps[index];
  $: props = tutorialProps[index];
</script>

<Tutorial {...props} {rbx} --header={INTERACTABLE_BORDER} />

<div class="flex">
  {#if index > 0}
    <button class="btn" on:click={() => index--}>PREV</button>
  {/if}
  {#if index < tutorialProps.length - 1}
    <button class="btn" on:click={() => index++}>NEXT</button>
  {/if}
</div>
