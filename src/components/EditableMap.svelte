<script lang="ts">
  import { currentEmoji, editableMap as map } from "../store";

  function clickedCell(index: number) {
    if ($currentEmoji == "") {
      map.removeEmoji(index);
      return;
    }

    map.addEmoji({
      index,
      emoji: $currentEmoji,
    });
  }
</script>

<svelte:window />

<section class="noselect">
  <div class="map">
    {#each { length: 256 } as _, i}
      <div on:click={() => clickedCell(i)}>
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

  .map {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 64vw;
    height: 64vw;
    gap: var(--cell-gap);
    border: 5px solid black;
  }

  .map > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: var(--cell);
    height: var(--cell);
    background-color: antiquewhite;
  }
</style>
