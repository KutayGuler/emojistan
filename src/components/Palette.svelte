<script lang="ts">
  // DATA
  import { palette as cp, currentColor, map } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { notifications } from "../routes/notifications";
  import { DEFAULT_BG } from "../constants";

  let pickedColor = "#000000";
  const flipParams = { duration: 300 };

  function setDefaultBackground(color: string) {
    if (color == "") return;
    if (color == $map.dbg) {
      // $dbg = DEFAULT_BG;
      map.updateDbg(DEFAULT_BG);
      return;
    }

    // $dbg = color;
    map.updateDbg(color);
    map.filterBackgrounds();
  }

  function removeColor(color: string) {
    cp.remove(color);
    if (!$cp.has($map.dbg)) {
      // $dbg = DEFAULT_BG;
      map.updateDbg(DEFAULT_BG);
    }
  }

  function addColor() {
    if ($cp.size == 8) {
      notifications.warning("Number of colors cannot exceed 8");
      return;
    }
    cp.add(pickedColor);
  }
</script>

<h4>Palette 🎨</h4>
<div class="relative flex w-full flex-row">
  <input class="h-12 w-full" type="color" bind:value={pickedColor} />
  <button class="add btn relative w-24  bg-white" on:click={addColor}
    >🎨
  </button>
</div>
<div class="flex h-1/3 w-full flex-row justify-end overflow-y-auto">
  <div class="h-full w-full">
    {#each [...$cp] as color (color)}
      <div
        class="relative mt-2 flex flex-row justify-start gap-2"
        transition:scale|local={flipParams}
        animate:flip={flipParams}
      >
        <div
          style:background={color}
          class="remove btn w-3/5"
          on:click={() => removeColor(color)}
        />
        <!-- <button class="hover:scale-125" >
          ❌
        </button> -->
        <!-- TODO: create dev and prod branches on github -->
        <button
          class:default={$map.dbg == color}
          class="w-1/3 opacity-50 hover:scale-125"
          on:click={() => setDefaultBackground(color)}>🌍</button
        >
        {#if color != $map.dbg}
          <button
            class="w-1/3 opacity-50 hover:scale-125"
            class:selected={$currentColor == color}
            on:click={() => {
              if ($currentColor == color) {
                $currentColor = "";
              } else {
                $currentColor = color;
              }
            }}
          >
            🖌️
          </button>
        {:else}
          <button class="w-1/3 cursor-default">&nbsp;</button>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .default,
  .selected {
    opacity: 1;
  }
</style>
