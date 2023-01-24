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

  tutorials.push({
    content: `<p style="color: red;">test</p>`,
    map: new EditableMap(
      new Map<number, string>([
        [1, "X"],
        [2, "Y"],
        [3, "Q"],
      ])
    ),
    pushes: new Map<number, Pushes>([[0, ["X", "Y", "push"]]]),
    merges: new Map<number, Merges>([[0, ["A", "B", "C"]]]),
    interactables: new Map<number, Interactable>(),
    statics: new Set(["Q"]),
  });

  // TODO: Continue lol
</script>

<main class="flex h-screen w-full flex-col items-center justify-center">
  <Node
    node={{
      id: 0,
      component: "pusher",
      position: { x: 0, y: 0 },
      width: PUSHER_W,
      height: PUSHER_H,
      bgColor: PUSHER_BG,
      borderColor: PUSHER_BORDER,
    }}
  >
    <Pusher id={-1} slots={["X", "Y", "push"]} editable={false} />
  </Node>

  {#each tutorials as { content, ...tutorial }}
    {@html content}
    <p>{JSON.stringify(Object.fromEntries(tutorial.pushes.entries()))}</p>
    <Game {...tutorial} {mapClass} {SIZE} />
  {/each}
</main>
