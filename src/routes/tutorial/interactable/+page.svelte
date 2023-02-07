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

  const firstTutorialProps = {
    header: "Interactable",
    description: "", // TODO: Description
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
</script>

<Tutorial {...firstTutorialProps} --header={INTERACTABLE_BORDER} />
