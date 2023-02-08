<script lang="ts">
  import {
    Interactable as TInteractable,
    Equippable,
    EditableMap,
    Evolve,
    Devolve,
    SequenceItem,
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
  const firstTutorialProps = {
    header: "Interactable",
    description:
      "Interactables are the most complex ruleboxes. We will explain each feature with examples.",
    component: Interactable,
    incremental: [464, 440, 400, 164, 0],
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
      // sideEffects: [
      //   ["any", 0],
      //   [-69, -1],
      // ],
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🐒"],
          [6, "🌵"],
        ])
      ),
      interactables: new Map<number, TInteractable>([
        [
          -2,
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
  };

  const secondTutorialProps = {
    header: "XDDD",
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
      emoji: "🚪",
      isStatic: true,
      sideEffects: [
        ["any", 0],
        [-69, -1],
      ],
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [0, "🐒"],
          [2, "🧱"],
          [3, "🍌"],
          [5, "🗝️"],
          [6, "🧱"],
          [8, "🚪"],
          [9, "🧱"],
          [10, "🧱"],
        ])
      ),
      equippables: new Map<number, Equippable>([
        [-69, new Equippable("🗝️", 1)],
      ]),
      interactables: new Map<number, TInteractable>([
        [
          -2,
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
        [
          -3,
          new TInteractable(
            "🍌",
            // @ts-expect-error
            [new SequenceItem("completeLevel")],
            1,
            1,
            [["any", -1]],
            false,
            new Evolve(false, "", 2),
            new Devolve(false, "")
          ),
        ],
      ]),

      mapClass: "simulation",
      SIZE: 4,
    },
  };

  let index = 0;
</script>

<Tutorial {...firstTutorialProps} --header={INTERACTABLE_BORDER} {index} />
{#if index == 0}
  <!-- STATIC -->
{:else if index == 1}
  <!-- <Tutorial {...secondTutorialProps} --header={INTERACTABLE_BORDER} /> -->
{/if}
<!-- EVOLUTION -->
<!-- DEVOLUTION -->
<!-- SIDE EFFECTS -->
<!-- EVENT SEQUENCE -->

<div class="flex">
  <button class="btn" on:click={() => index--}>PREV</button>

  <button class="btn" on:click={() => index++}>NEXT</button>
</div>
