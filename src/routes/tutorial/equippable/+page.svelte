<script lang="ts">
  import { type Equippable as TEquippable, EditableMap } from "$src/types";
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
    description:
      "Equippable takes two emoji inputs and makes 🔴 pushable by 🟢",
    component: Equippable,
    node: {
      id: 0,
      component: "pusher",
      position: { x: 0, y: 0 },
      width: EQUIPPABLE_W,
      height: EQUIPPABLE_H,
      bgColor: EQUIPPABLE_BG,
      borderColor: EQUIPPABLE_BORDER,
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
      // equippables:  new Map<number, TEquippable>([[0, ]]),
      mapClass: "simulation",
      SIZE: 4,
    },
  };
</script>

<Tutorial {...tutorialProps} --header={EQUIPPABLE_BORDER} />
