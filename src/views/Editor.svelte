<script lang="ts">
  import { SIZE } from "$src/constants";
  import { currentEmoji, currentColor, map } from "../store";

  export let showIndex = false;

  function clickedCell(index: number) {
    if ($currentColor != "" && $currentColor != $map.dbg) {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji != "") {
      map.addEmoji(index, $currentEmoji);
    }
  }

  // TODO: Right click to copy

  function rightClickedCell(index: number) {
    if ($map.items.has(index)) {
      map.removeEmoji(index);
    } else {
      map.deleteBackground(index);
    }
  }
</script>

<div class="map">
  {#each { length: SIZE * SIZE } as _, i}
    <div
      class="cell"
      style:background={$map.backgrounds.get(i) || $map.dbg}
      on:click={() => clickedCell(i)}
      on:contextmenu|preventDefault={() => rightClickedCell(i)}
    >
      {$map?.items.get(i) || (showIndex ? i : "")}
    </div>
  {/each}
</div>
