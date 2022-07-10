<script lang="ts">
  // import autoAnimate from "@formkit/auto-animate";
  import { onMount } from "svelte/internal";
  import { invertColor } from "../invertColor";
  import Collision from "../components/events/Collision.svelte";
  import {
    events,
    colorPalette,
    hasEmptySlot,
    staticItems,
    currentEmoji,
  } from "../store";

  let color = "";
  let r: any, defaultBackground: string;

  onMount(() => {
    r = document.querySelector(":root");
    // @ts-ignore
    defaultBackground = getComputedStyle(r).getPropertyValue(
      "--default-background"
    );
  });

  function setDefaultBackground(color: string) {
    if (color == "") return;
    // @ts-ignore
    if (color == defaultBackground) {
      r.style.setProperty("--default-background", "antiquewhite");
      r.style.setProperty("--inverted", "var(--danger)");
      defaultBackground = "antiquewhite";
      return;
    }

    r.style.setProperty("--default-background", color);
    r.style.setProperty("--inverted", invertColor(color));
    defaultBackground = color;
  }

  function removeColor(color: string) {
    colorPalette.removeColor(color);
    if (!$colorPalette.includes(defaultBackground)) {
      r.style.setProperty("--default-background", "antiquewhite");
      r.style.setProperty("--inverted", "var(--danger)");
      defaultBackground = "antiquewhite";
    }
  }
</script>

<section class="noselect">
  <p>Objects will bump into each other by default</p>
  {#each Object.entries($events.collisions) as [id, rule], i}
    <Collision id={+id} {rule} />
  {/each}
  {#if !$hasEmptySlot || Object.keys($events.collisions).length == 0}
    <button on:click={() => events.addCollision("")}>Add Collision</button>
  {/if}
  <p>Static items cannot be moved by players</p>
  <div
    class="statics noselect"
    on:click={() => staticItems.toggleEmoji($currentEmoji, "add")}
  >
    {#each $staticItems as item}
      <div>
        <div>{item}</div>
        <button on:click={() => staticItems.toggleEmoji(item)}>❌</button>
      </div>
    {:else}
      <p>Select an emoji and click here to set it as a static item</p>
    {/each}
  </div>
  <p>🎨</p>
  <input type="color" bind:value={color} />
  <button on:click={() => colorPalette.addColor(color)}>Add to 🎨</button>
  <div class="palette">
    {#each $colorPalette as color}
      <div class="color-container">
        <div
          class="color"
          class:isDefault={color == defaultBackground}
          style="background-color: {color};"
          on:click={() => setDefaultBackground(color)}
        />

        <button class="remove-color" on:click={() => removeColor(color)}>
          ❌
        </button>
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 1%;
    padding: 1%;
    box-sizing: border-box;
  }

  .statics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    height: 10vh;
    border: 5px solid black;
  }

  .statics > div {
    display: flex;
    flex-direction: row;
  }

  .statics > p {
    align-self: center;
    text-align: center;
    width: 100%;
  }

  .palette {
    display: flex;
    flex-direction: row;
  }

  .color-container,
  .color {
    position: relative;
    width: 10vw;
    height: 10vw;
  }

  .isDefault::after {
    content: "🌍";
    color: white;
    mix-blend-mode: difference;
  }

  .remove-color {
    z-index: 99;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
