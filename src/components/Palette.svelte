<script lang="ts">
  // DATA
  import { palette as cp, defaultBackground as dbg } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { notifications } from "../routes/notifications";

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
      r.style.setProperty("--default-background", "#faebd7");
      defaultBackground = "#faebd7";
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
      r.style.setProperty("--default-background", "#faebd7");
      defaultBackground = "#faebd7";
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

<div class="flex h-full w-1/6 flex-row justify-end">
  <div class="h-full w-3/4">
    <h4 class="info" on:click={() => modal.show("palette")}>Palette 🎨</h4>
    <div class="relative">
      <button class="btn add relative w-full  bg-white" on:click={addColor}
        >🎨
      </button>
      <input
        class="absolute -left-6 top-6 h-2/5 w-6"
        type="color"
        bind:value={pickedColor}
        on:change={pickedColorChanged}
      />
    </div>

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
          class="remove btn"
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
