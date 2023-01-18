<script lang="ts">
  import { SIZE } from "$src/constants";
  import { currentEmoji, currentColor, map } from "../store";

  export let showIndex = false;
  export let deleteMode: "Item" | "Background" | "Both";

  function clickedCell(index: number) {
    switch (deleteMode) {
      case "Item":
        if ($currentEmoji == "") map.removeEmoji(index);
        break;
      case "Background":
        if ($currentColor == "") map.deleteBackground(index);
        break;
      case "Both":
        if ($currentColor == "") map.deleteBackground(index);
        if ($currentEmoji == "") map.removeEmoji(index);
        break;
    }
    if ($currentColor != "" && $currentColor != $map.dbg) {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji != "") {
      map.addEmoji(index, $currentEmoji);
    }
  }

  function rightClickedCell(index: number) {
    $currentEmoji = $map.items.get(index) || "";
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
