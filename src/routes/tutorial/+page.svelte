<script lang="ts">
  import {
    type Merges,
    type Pushes,
    Interactable,
    EditableMap,
  } from "$src/types";
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
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
  {#each tutorials as { content, ...tutorial }}
    {@html content}
    <Game {...tutorial} {mapClass} {SIZE} />
  {/each}
</main>
