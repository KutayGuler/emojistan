<script lang="ts">
  // DATA
  import { palette as cp, currentColor, map } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { notifications } from "../routes/notifications";
  import { DEFAULT_BG } from "../constants";

  let pickedColor = "#000000";
  const flipParams = { duration: 300 };

  function setDefaultBackground() {
    if ($currentColor == "") return;
    if ($currentColor == $map.dbg) {
      map.updateDbg(DEFAULT_BG);
      return;
    }

    map.updateDbg($currentColor);
    map.filterBackgrounds();
  }

  function removeColor() {
    console.log($cp);
    cp.remove($currentColor);
    if (!$cp.has($map.dbg)) {
      map.updateDbg(DEFAULT_BG);
    }
    console.log($cp);
  }

  function addColor(e) {
    if (e.target.tagName == "INPUT") return;

    if ($cp.size == 8) {
      notifications.warning("Number of colors cannot exceed 8");
      return;
    }
    cp.add(pickedColor);
  }
</script>

<p class="label-text pt-4">Palette 🎨</p>
<div class="flex flex-col gap-2">
  <div class="flex flex-row gap-2">
    <!-- <button
      on:click={setDefaultBackground}
      title="Set as default background color"
      class="btn flex-grow"
      disabled={$currentColor == "" || !$cp.has($currentColor)}
      ><span style:background={$currentColor} class="h-4 w-4" />&nbsp; 🌍</button
    >
    <button
      on:click={removeColor}
      title="Remove selected color"
      class="btn flex-grow"
      disabled={$currentColor == "" || !$cp.has($currentColor)}
      ><span style:background={$currentColor} class="h-4 w-4" />&nbsp; ❌
    </button> -->
    <!-- disabled={$cp.has(pickedColor)} -->
    <button
      title="Add selected color"
      class="btn h-16 flex-grow text-2xl"
      on:click={addColor}
    >
      <input
        style:background={$map.dbg}
        class="h-12 w-12 cursor-pointer border-0"
        type="color"
        bind:value={pickedColor}
      />&nbsp; +
    </button>
  </div>

  <div class="inline-flex w-full items-center justify-center gap-2 pt-2">
    {#each [...$cp] as color (color)}
      <div
        class="{color == $currentColor
          ? 'scale-125'
          : ''} h-12 w-12 cursor-pointer rounded duration-150 ease-out hover:scale-125"
        transition:scale|local={flipParams}
        animate:flip={flipParams}
        style:background={color}
        on:click={() => {
          if ($currentColor == color) {
            $currentColor = "";
          } else {
            $currentColor = color;
          }
        }}
      />
    {/each}
  </div>
</div>

<style>
  .default,
  .selected {
    opacity: 1;
  }
</style>
