<script lang="ts">
  import { type Consumable as TConsumable, EditableMap } from "$src/types";
  import {
    CONSUMABLE_BG,
    CONSUMABLE_BORDER,
    CONSUMABLE_H,
    CONSUMABLE_W,
  } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Consumable from "$components/Consumable.svelte";

  const tutorialProps = {
    header: "Consumable",
    description:
      "Consumable takes two emoji inputs and makes 🔴 pushable by 🟢",
    component: Consumable,
    node: {
      id: 0,
      component: "pusher",
      position: { x: 0, y: 0 },
      width: CONSUMABLE_W,
      height: CONSUMABLE_H,
      bgColor: CONSUMABLE_BG,
      borderColor: CONSUMABLE_BORDER,
    },
    props: {
      id: -1, 
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🟢"],
          [6, "🔴"],
        ])
      ),
      consumables: new Map<number, TConsumable>([
        [0, { emoji: "🟢", hp: 1, mutateConsumerTo: "" }],
      ]),
      mapClass: "simulation",
      SIZE: 4,
      showUI: true,
    },
  };
</script>

<Tutorial {...tutorialProps} --header={CONSUMABLE_BORDER} />
