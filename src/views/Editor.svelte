<script lang="ts">
  import { currentEmoji, currentColor, map } from "../store";
  const deleteModes = ["Item", "Background", "Both"];
  let deleteMode = deleteModes[2];

  export let showIndex = false;

  function clickedCell(index: number) {
    if ($currentColor == "" && $currentEmoji == "") {
      switch (deleteMode) {
        case "Item":
          map.removeEmoji(index);
          break;
        case "Background":
          map.deleteBackground(index);
          break;
        default:
        case "Both":
          map.removeEmoji(index);
          map.deleteBackground(index);
          break;
      }
      return;
    }

    if ($currentColor != "" && $currentColor != $map.dbg) {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji != "") {
      // db.saves.update();
      map.addEmoji(index, $currentEmoji);
    }
  }
</script>

<div class="map">
  {#each { length: 256 } as _, i}
    <div
      class="cell"
      style:background={$map.backgrounds.get(i) || $map.dbg}
      on:click={() => clickedCell(i)}
    >
      {$map?.items.get(i) || (showIndex ? i : "")}
    </div>
  {/each}
</div>
