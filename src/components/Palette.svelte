<script lang="ts">
  // DATA
  import { palette as cp } from "../store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { notifications } from "../routes/notifications";

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
    <h4 class="text-center text-xl" on:click={() => modal.show("palette")}>
      Palette 🎨
    </h4>
    <div class="relative flex flex-row justify-center">
      <button class="btn add relative w-full  bg-white" on:click={addColor}
        >🎨
      </button>
      <input
        class="absolute top-4 left-8 h-4/5 w-6"
        type="color"
        bind:value={pickedColor}
        on:change={pickedColorChanged}
      />
    </div>
    <div
      style:background={defaultBackground}
      class="flex h-5/6 flex-col items-center justify-start gap-4 rounded-lg py-4 pb-4 shadow-lg"
    >
      {#each [...$cp] as color (color)}
        <div
          class="relative flex flex-row items-center justify-center"
          transition:scale|local={flipParams}
          animate:flip={flipParams}
        >
          <div style:background={color} class="color" />
          <button
            class="absolute -top-2 left-0 hover:scale-125 "
            on:click={() => setDefaultBackground(color)}>🌍</button
          >
          <button
            class="absolute -top-2 right-0 hover:scale-125"
            on:click={() => removeColor(color)}>❌</button
          >
        </div>
      {/each}
    </div>
  </div>
</div>
