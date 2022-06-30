<script lang="ts">
  import { canMove, currentEmoji, playableMap as map } from "../store";

  let activeCell = 0;
  let arrowKeys = [37, 38, 39, 40];
  function handle(e: KeyboardEvent) {
    if (!arrowKeys.includes(e.keyCode)) return;
    map.moveEmoji(e.keyCode, activeCell);
    activeCell += canMove(e.keyCode, activeCell);
  }
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <div class="map">
    {#each { length: 256 } as _, i}
      <div class:active={activeCell == i}>
        {$map?.items[i]?.emoji || ""}
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
