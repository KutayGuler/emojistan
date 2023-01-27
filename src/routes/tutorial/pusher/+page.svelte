<script lang="ts">
  import {
    type Merges,
    type Pushes,
    Interactable,
    EditableMap,
  } from "$src/types";
  import { PUSHER_BG, PUSHER_BORDER, PUSHER_H, PUSHER_W } from "$src/constants";
  import Node from "$lib/Nodes/index.svelte";
  import Pusher from "$components/Pusher.svelte";
  import Game from "$src/views/Game.svelte";

  const mapClass = "simulation";
  const SIZE = 4;

  let tutorials: Array<any> = [];

  let pusherTutorial = {
    content: `<p class="bg-red-500">test</p>`,
    node: {
      id: 0,
      component: "pusher",
      position: { x: 0, y: 0 },
      width: PUSHER_W,
      height: PUSHER_H,
      bgColor: PUSHER_BG,
      borderColor: PUSHER_BORDER,
    },
    component: Pusher,
    props: {
      id: -1,
      slots: ["🟢", "🔴", "push"],
      editable: false,
    },
    map: new EditableMap(
      new Map<number, string>([
        [5, "🟢"],
        [6, "🔴"],
      ])
    ),
    pushes: new Map<number, Pushes>([[0, ["🟢", "🔴", "push"]]]),
    merges: new Map<number, Merges>([[0, ["A", "B", "C"]]]),
    interactables: new Map<number, Interactable>(),
    statics: new Set(["Q"]),
  };

  tutorials.push(pusherTutorial);
</script>

{#each tutorials as { content, node, component, props, ...tutorial }}
  <h1 class="self-start text-4xl">Pusher</h1>
  <div
    style="height: {node.height}px; width: {node.width}px;"
    class="tooltip tooltip-right relative self-start"
    data-tip="Pusher takes two emoji inputs and makes 🔴 pushable by 🟢"
  >
    <Node {node}>
      <svelte:component this={component} {...props} />
    </Node>
  </div>
  <!-- <div class="flex flex-row items-start justify-between gap-16">
    <div style="width: {node.width}px;" class="flex flex-col items-stretch" />
  </div> -->
  <Game {...tutorial} {mapClass} {SIZE} />
  <p class="w-1/6 text-sm">Push 🔴 3 times</p>
{/each}
