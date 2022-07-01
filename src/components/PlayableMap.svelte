<script lang="ts">
  import { onMount } from "svelte";
  import { editableMap, playableMap as map } from "../store";

  function canMove(keyCode: number, index: number) {
    if (keyCode == 37 && index % 16 == 0) return 0;
    if (keyCode == 38 && index < 16) return 0;
    if (keyCode == 39 && (index + 1) % 16 == 0) return 0;
    if (keyCode == 40 && index >= 240) return 0;
    return (keyCode % 2 == 0 ? 16 : 1) * (keyCode >= 39 ? 1 : -1);
  }

  let ghost = true;
  let activeCell = 0;
  let arrowKeys = [37, 38, 39, 40];
  function handle(e: KeyboardEvent) {
    console.log($editableMap.items);

    if (e.keyCode == 32) ghost = !ghost;
    if (!arrowKeys.includes(e.keyCode)) return;
    let operation = canMove(e.keyCode, activeCell);
    if (operation != 0) {
      if (!ghost) map.moveEmoji(activeCell, operation);
      console.log($editableMap.items);
      activeCell += operation;
    }
  }

  onMount(() => {
    map.loadItems(JSON.parse(JSON.stringify($editableMap.items)));
  });
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
  <div class="map">
    {#each { length: 256 } as _, i}
      <div class:active={activeCell == i}>
        {$map?.items[i]?.emoji || ""}
        <!-- {"🌴"} -->
      </div>
    {/each}
  </div>
</section>

<style>
  :root {
    --cell-size: 4vw;
    --cell: 3.8vw;
    --cell-gap: calc(var(--cell-size) - var(--cell));
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .active {
    border: 1px solid red;
  }
</style>
