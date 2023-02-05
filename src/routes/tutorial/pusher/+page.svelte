<script lang="ts">
  import {
    type Merger,
    type Pusher,
    Interactable,
    EditableMap,
  } from "$src/types";
  import { PUSHER_BG, PUSHER_BORDER, PUSHER_H, PUSHER_W } from "$src/constants";
  import Tutorial from "../Tutorial.svelte";
  import Pusher from "$components/Pusher.svelte";

  const tutorialProps = {
    header: "Pusher",
    description: "Pusher takes two emoji inputs and makes 🔴 pushable by 🟢",
    component: Pusher,
    node: {
      id: 0,
      component: "pusher",
      disabled: true,
      position: { x: 0, y: 0 },
      width: PUSHER_W,
      height: PUSHER_H,
      bgColor: PUSHER_BG,
      borderColor: PUSHER_BORDER,
    },
    props: {
      id: -1,
      slots: ["🟢", "🔴", "push"],
      editable: false,
    },
    gameProps: {
      map: new EditableMap(
        new Map<number, string>([
          [5, "🟢"],
          [6, "🔴"],
        ])
      ),
      pushers: new Map<number, Pusher>([[0, ["🟢", "🔴", "push"]]]),
      mapClass: "simulation",
      SIZE: 4,
    },
  };
</script>

<Tutorial {...tutorialProps} />
