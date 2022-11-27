<script lang="ts">
  // DATA
  import { palette as cp, defaultBackground as dbg } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { notifications } from "../routes/notifications";
  import { DEFAULT_BG } from "../constants";

  let r: any;
  let pickedColor = "#000000";
  let defaultBackground = $dbg;
  const flipParams = { duration: 300 };

  onMount(() => {
    r = document.querySelector(":root");
    let compStyle = getComputedStyle(r);
    defaultBackground = compStyle.getPropertyValue("--default-background");
    $dbg = defaultBackground;
    pickedColor = compStyle.getPropertyValue("--picked-color");
  });

  function setDefaultBackground(color: string) {
    if (color == "") return;
    if (color == defaultBackground) {
      r.style.setProperty("--default-background", DEFAULT_BG);
      defaultBackground = DEFAULT_BG;
      $dbg = defaultBackground;
      return;
    }

    r.style.setProperty("--default-background", color);
    defaultBackground = color;
    $dbg = defaultBackground;
  }

  function removeColor(color: string) {
    cp.remove(color);
    if (!$cp.has(defaultBackground)) {
      r.style.setProperty("--default-background", DEFAULT_BG);
      defaultBackground = DEFAULT_BG;
      $dbg = defaultBackground;
    }
  }

  function pickedColorChanged() {
    r.style.setProperty("--picked-color", pickedColor);
  }

  function addColor() {
    if ($cp.size == 8) {
      notifications.warning("Number of colors cannot exceed 8");
      return;
    }
    cp.add(pickedColor);
  }
</script>

<h4>
  Palette 🎨 <input
    class=""
    type="color"
    bind:value={pickedColor}
    on:change={pickedColorChanged}
  />
</h4>
<div class="relative w-full">
  <button class="add btn relative w-full  bg-white" on:click={addColor}
    >🎨
  </button>
</div>
<div class="flex h-1/3 w-full flex-row justify-end overflow-y-auto">
  <div class="h-full w-full">
    {#each [...$cp] as color (color)}
      <div
        class="relative"
        transition:scale|local={flipParams}
        animate:flip={flipParams}
      >
        <button
          class:default={defaultBackground == color}
          class="absolute -left-6 top-6 opacity-50 hover:scale-125"
          on:click={() => setDefaultBackground(color)}>🌍</button
        >
        <div
          on:click={() => removeColor(color)}
          style:background={color}
          class="remove btn w-full"
        >
          &nbsp;
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .default {
    opacity: 1;
  }
</style>
