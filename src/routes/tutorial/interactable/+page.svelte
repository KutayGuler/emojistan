<script lang="ts">
  import { type Interactable as TInteractable, EditableMap } from "$src/types";
  import {
    INTERACTABLE_BG,
    INTERACTABLE_BORDER,
    INTERACTABLE_H,
    INTERACTABLE_W,
  } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Interactable from "$components/Interactable.svelte";

  const tutorialProps = {
    header: "Interactable",
    description:
      "Interactable takes three emoji inputs. To put it simply, 🔴 + 🟢 = 🟡",
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
      slots: {
        emoji: "X",
        hp: 1,
        points: 1,
      },
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🟢"],
          [6, "🔴"],
        ])
      ),
      interactables: new Map<number, Interactable>([
        [
          0,
          {
            emoji: "",
            sequence: [],
            hp: 1,
            points: 1,
            modifiers: ["any", -1],
            evolve: {},
            devolve: {},
          },
        ],
      ]),
      mapClass: "simulation",
      SIZE: 4,
    },
  };
</script>

<Tutorial {...tutorialProps} --header={INTERACTABLE_BORDER} />
