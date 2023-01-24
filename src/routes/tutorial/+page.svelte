<script lang="ts">
  import {
    type Merges,
    type Pushes,
    Interactable,
    EditableMap,
  } from "$src/types";
  import Game from "$src/views/Game.svelte";

  let map = new EditableMap();
  let pushes = new Map<number, Pushes>();
  pushes.set(0, ["X", "Y", "push"]);
  let merges = new Map<number, Merges>();
  merges.set(0, ["A", "B", "C"]);

  let interactables = new Map<number, Interactable>();
  // interactables.set(0, new Interactable())

  let statics = new Set(["Q"]);
</script>

<main class="flex h-full w-full flex-col items-center justify-center">
  <Game
    {map}
    {pushes}
    {merges}
    {interactables}
    {statics}
    mapClass="simulation"
    SIZE={4}
  />
</main>
