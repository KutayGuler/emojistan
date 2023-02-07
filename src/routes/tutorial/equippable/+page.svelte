<script lang="ts">
  import {
    Equippable as TEquippable,
    EditableMap,
    Interactable,
    Devolve,
    Evolve,
  } from "$src/types";
  import {
    EQUIPPABLE_BG,
    EQUIPPABLE_BORDER,
    EQUIPPABLE_H,
    EQUIPPABLE_W,
  } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Equippable from "$components/Equippable.svelte";

  const tutorialProps = {
    header: "Equippable",
    // TODO: Description
    description: "",
    component: Equippable,
    node: {
      id: 0,
      component: "equippable",
      position: { x: 0, y: 0 },
      width: EQUIPPABLE_W,
      height: EQUIPPABLE_H,
      bgColor: EQUIPPABLE_BG,
      borderColor: EQUIPPABLE_BORDER,
    },
    props: {
      id: -69,
      emoji: "🗝️",
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [0, "🐒"],
          [2, "🧱"],
          [5, "🗝️"],
          [6, "🧱"],
          [8, "🚪"],
          [9, "🧱"],
          [10, "🧱"],
        ])
      ),
      equippables: new Map<number, TEquippable>([
        [-69, new TEquippable("🗝️", 1)],
      ]),
      interactables: new Map<number, Interactable>([
        [
          -1,
          new Interactable(
            "🚪",
            [],
            1,
            1,
            [
              ["any", 0],
              [-69, -1],
            ],
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

<Tutorial {...tutorialProps} --header={EQUIPPABLE_BORDER} />
