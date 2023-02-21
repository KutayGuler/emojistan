<script lang="ts">
  import { DEFAULT_SIDE_LENGTH } from "$src/constants";
  import { currentEmoji, currentColor, map } from "../store";

  export let showIndex = false;
  export let deleteMode: "Item" | "Background" | "Both";
  export let copyMode: "Item" | "Background" | "Both";

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
    switch (copyMode) {
      case "Item":
        $currentEmoji = $map.items.get(index) || "";
        break;
      case "Background":
        $currentColor = $map.backgrounds.get(index) || "";
        break;
      case "Both":
        $currentEmoji = $map.items.get(index) || "";
        $currentColor = $map.backgrounds.get(index) || "";
        break;
    }
  }

  let holding = false;

  function mouseEnter(index: number) {
    if (holding) clickedCell(index);
  }
</script>

<svelte:window
  on:mousedown={() => (holding = true)}
  on:mouseup={() => (holding = false)}
/>

<div class="map">
  {#each { length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH } as _, i}
    <div
      style:background={$map.backgrounds.get(i) || $map.dbg}
      on:mouseenter={() => mouseEnter(i)}
      on:click={() => clickedCell(i)}
      on:contextmenu|preventDefault={() => rightClickedCell(i)}
    >
      {$map?.items.get(i) || (showIndex ? i : "")}
    </div>
  {/each}
</div>
