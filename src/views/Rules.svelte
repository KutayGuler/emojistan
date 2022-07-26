<script lang="ts">
  // import autoAnimate from "@formkit/auto-animate";
  import { onMount } from "svelte/internal";
  import { invertColor } from "../invertColor";
  import Collision from "../components/rules/Collision.svelte";
  import {
    collisions,
    events,
    conditions,
    colorPalette,
    hasEmptySlot,
    statics,
    interactables,
    currentEmoji,
  } from "../store";
  import Condition from "../components/rules/Condition.svelte";
  import Event from "../components/rules/Event.svelte";
  import LoopEvent from "../components/rules/LoopEvent.svelte";

  let color = "";
  let r: any, defaultBackground: string;
  let eventIndex = 0;
  let loopEventIndex = 0;

  onMount(() => {
    r = document.querySelector(":root");
    defaultBackground = getComputedStyle(r).getPropertyValue(
      "--default-background"
    );
  });

  function setDefaultBackground(color: string) {
    if (color == "") return;
    if (color == defaultBackground) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
      return;
    }

    r.style.setProperty("--default-background", color);
    r.style.setProperty("--inverted", invertColor(color));
    defaultBackground = color;
  }

  function removeColor(color: string) {
    colorPalette.removeColor(color);
    if (!$colorPalette.includes(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
    }
  }
</script>

<section class="noselect rules">
  <div id="collisions">
    <h4>Collisions 🤼</h4>
    <p>Objects will bump into each other by default</p>
    {#each Object.entries($collisions) as [id, rule]}
      <Collision id={+id} {rule} />
    {/each}
    {#if !$hasEmptySlot || Object.keys($collisions).length == 0}
      <button on:click={() => collisions.addCollision("")}>🤼</button>
    {/if}
  </div>
  <div id="statics">
    <h4>Static Objects 🗿</h4>
    <p>Static objects cannot be moved by players</p>
    <div
      class="statics noselect"
      on:click={() => statics.toggleEmoji($currentEmoji, "add")}
    >
      {#each $statics as item}
        <div>
          <div>{item}</div>
          <button on:click={() => statics.toggleEmoji(item)}>❌</button>
        </div>
      {:else}
        <p>Select an emoji and click here to set it as a static item</p>
      {/each}
    </div>
    <h4>Interactable Objects ♟️</h4>
    <div
      class="statics noselect"
      on:click={() => interactables.toggleEmoji($currentEmoji, "add")}
    >
      {#each $interactables as item}
        <div>
          <div>{item}</div>
          <button on:click={() => interactables.toggleEmoji(item)}>❌</button>
        </div>
      {:else}
        <p>Select an emoji and click here to set it as a static item</p>
      {/each}
    </div>
  </div>
  <div id="conditions">
    <h4>Conditions ❓</h4>
    {#each Object.entries($conditions) as [id, { a, b, eventID, once }]}
      <Condition id={+id} {a} {b} {eventID} {once} />
    {/each}
    <button
      on:click={() =>
        conditions.addCondition({
          a: "playerBackground",
          b: "",
          eventID: 0,
          once: false,
        })}>❓</button
    >
  </div>
  <div id="events">
    <h4>Events 🧨</h4>
    {#each Object.entries($events) as [id, { name, queue, loop }]}
      {#if loop != undefined}
        <LoopEvent id={+id} {name} {queue} {loop} />
      {:else}
        <Event id={+id} {name} {queue} />
      {/if}
    {/each}
    <button
      on:click={() =>
        events.addEvent({
          name: `Event${eventIndex++}`,
          queue: [{ type: "setBackgroundOf", index: 0, background: "" }],
        })}>🧨</button
    >
    <button
      on:click={() =>
        events.addEvent({
          name: `LoopEvent${loopEventIndex++}`,
          queue: [{ type: "setBackgroundOf", index: 0, background: "" }],
          loop: {
            start: 0,
            end: 16,
            iterationNumber: 1,
            iterationType: "increment",
            timeGap: 50,
            reverse: false,
          },
        })}>➰🧨</button
    >
  </div>
  <div id="palette">
    <h4>Color Palette 🎨</h4>
    <input type="color" bind:value={color} />
    <button on:click={() => colorPalette.addColor(color)}>Add Color</button>
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
  </div>
</section>

<style>
  .rules {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2%;
    padding: 2%;
    overflow-y: auto;
    height: 94vh;
    box-sizing: border-box;
  }

  #collisions {
    grid-area: 1 / 1 / 2 / 2;
  }
  #statics {
    grid-area: 1 / 2 / 2 / 3;
  }
  #conditions {
    grid-area: 2 / 1 / 3 / 2;
  }
  #events {
    grid-area: 2 / 2 / 3 / 3;
  }
  #palette {
    grid-area: 3 / 1 / 4 / 3;
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
    font-size: 2rem;
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
