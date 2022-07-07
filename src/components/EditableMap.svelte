<script lang="ts">
  import { currentEmoji, editableMap as map } from "../store";

  let showIndex = false;
  let paintMode = false;
  let color = "";

  function clickedCell(index: number) {
    if (paintMode) {
      map.updateBackground(index, color);
      return;
    }

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
  <input type="text" placeholder="Objective" bind:value={$map.objective} />
  <p><input type="checkbox" bind:checked={showIndex} />Show Index</p>
  <p><input type="checkbox" bind:checked={paintMode} />Paint Mode</p>
  {#if paintMode}
    <input type="color" bind:value={color} />
  {/if}
  <div class="map">
    {#each { length: 256 } as _, i}
      <div
        style:background={$map.backgrounds[i]}
        on:click={() => clickedCell(i)}
      >
        {$map?.items[i]?.emoji || (showIndex ? i : "")}
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
