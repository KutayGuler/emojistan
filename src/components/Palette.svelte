<script lang="ts">
  // DATA
  import { palette as cp } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";

  let r: any;
  let pickedColor = "#000000";
  let defaultBackground = "#faebd7";
  const flipParams = { duration: 300 };

  onMount(() => {
    r = document.querySelector(":root");
    let compStyle = getComputedStyle(r);
    defaultBackground = compStyle.getPropertyValue("--default-background");
    pickedColor = compStyle.getPropertyValue("--picked-color");
  });

  function setDefaultBackground(color: string) {
    if (color == "") return;
    if (color == defaultBackground) {
      r.style.setProperty("--default-background", "#faebd7");
      defaultBackground = "#faebd7";
      return;
    }

    r.style.setProperty("--default-background", color);
    defaultBackground = color;
  }

  function removeColor(color: string) {
    cp.remove(color);
    if (!$cp.has(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      defaultBackground = "#faebd7";
    }
  }

  function pickedColorChanged() {
    r.style.setProperty("--picked-color", pickedColor);
  }
</script>

<div class="absolute -right-40 top-44 flex-1">
  <div
    style:background={defaultBackground}
    class="my-4 flex flex-col items-start justify-start rounded-lg pb-4 shadow-lg"
  >
    {#each [...$cp, ""] as color (color)}
      <div transition:scale|local={flipParams} animate:flip={flipParams}>
        {#if color == ""}
          <div class="relative">
            <button
              class="statics-add-btn relative bg-white"
              on:click={() => cp.add(pickedColor)}
              >🎨
            </button>
            <input
              class="absolute -bottom-0 -right-full h-full w-full"
              type="color"
              bind:value={pickedColor}
              on:change={pickedColorChanged}
            />
          </div>
        {:else}
          <div style:background={color} class="color">
            <button on:click={() => setDefaultBackground(color)}>🌍</button>
            <button on:click={() => removeColor(color)}>❌</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
