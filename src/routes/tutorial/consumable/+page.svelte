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

  const firstTutorialProps = {
    header: "Consumable",
    description:
      "Consumable takes an emoji and an HP input. Emoji is the consumable itself while HP determines how much the consumer will gain or lose.",
    component: Consumable,
    node: {
      id: 0,
      component: "consumable",
      position: { x: 0, y: 0 },
      width: CONSUMABLE_W,
      height: CONSUMABLE_H,
      bgColor: CONSUMABLE_BG,
      borderColor: CONSUMABLE_BORDER,
    },
    props: {
      id: -1,
      emoji: "🍌",
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🐒"],
          [6, "🍌"],
        ])
      ),
      consumables: new Map<number, TConsumable>([
        [-1, { emoji: "🍌", hp: 1, mutateConsumerTo: "" }],
      ]),
      mapClass: "simulation",
      SIZE: 4,
    },
  };

  const secondTutorialProps = {
    description:
      "You can also enable mutation by clicking the 🧬 icon on the top left corner. This option opens up another slot to determine what the consumer will mutate into.",
    component: Consumable,
    node: {
      id: 0,
      component: "consumable",
      position: { x: 0, y: 0 },
      width: CONSUMABLE_W,
      height: CONSUMABLE_H,
      bgColor: CONSUMABLE_BG,
      borderColor: CONSUMABLE_BORDER,
    },
    props: {
      id: -2,
      emoji: "🧪",
      mutateConsumer: true,
      mutateConsumerTo: "🐖",
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🐒"],
          [6, "🧪"],
        ])
      ),
      consumables: new Map<number, TConsumable>([
        [-2, { emoji: "🧪", hp: 1, mutateConsumerTo: "🐖" }],
      ]),
      mapClass: "simulation",
      SIZE: 4,
    },
  };
</script>

<Tutorial {...firstTutorialProps} --header={CONSUMABLE_BORDER} />
<Tutorial {...secondTutorialProps} />
