<script lang="ts">
  import { onMount } from "svelte/internal";
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
      defaultBackground = "antiquewhite";
      return;
    }

    r.style.setProperty("--default-background", color);
    defaultBackground = color;
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
  <p>Color Palette</p>
  <input type="color" bind:value={color} />
  <button on:click={() => colorPalette.addColor(color)}>Add to palette</button>
  {#each $colorPalette.colors as color}
    <div class="color-container">
      <div
        class="color"
        style="background-color: {color};"
        on:click={() => setDefaultBackground(color)}
      >
        {color == defaultBackground ? "Default Background" : ""}
      </div>

      <button
        class="remove-color"
        on:click={() => colorPalette.removeColor(color)}
      >
        ❌
      </button>
    </div>
  {/each}
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

  .color-container,
  .color {
    position: relative;
    width: 10vw;
    height: 10vw;
  }

  .remove-color {
    z-index: 99;
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
