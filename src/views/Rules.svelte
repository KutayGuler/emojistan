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
    statics,
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
    if (!$colorPalette.has(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
    }
  }
</script>

<section class="noselect rules">
  <!-- TODO: Add tooltip to collisions -->
  <div id="collisions">
    <h4 title="Objects will bump into each other by default">Collisions 🤼</h4>
    {#each [...$collisions] as [id, rule]}
      <Collision {id} {rule} />
    {/each}
    <button title="Add Collision" on:click={() => collisions.add("")}>🤼</button
    >
  </div>
  <div id="statics">
    <!-- TODO: Add tooltip to statics -->
    <h4>Static Items 🗿</h4>
    <p>Static items cannot be moved by players</p>
    <div
      class="statics noselect"
      on:click={() => statics.toggleEmoji($currentEmoji, "add")}
    >
      {#each [...$statics] as item}
        <div>
          <div>{item}</div>
          <button on:click={() => statics.toggleEmoji(item)}>❌</button>
        </div>
      {:else}
        <p>Select an emoji and click here to set it as a static item</p>
      {/each}
    </div>
  </div>
  <div id="conditions">
    <h4>Conditions ❓</h4>
    {#each [...$conditions] as [id, { a, b, _b, eventID }]}
      <Condition {id} {a} {b} {_b} {eventID} />
    {/each}
    <button
      title="Add Condition"
      on:click={() =>
        conditions.add({
          a: "playerBackground",
          b: "",
          _b: "any",
          eventID: "",
        })}>❓</button
    >
  </div>
  <div id="events">
    <h4>Events 🧨</h4>
    {#each [...$events] as [id, { name, sequence, loop }]}
      {#if loop != undefined}
        <LoopEvent {id} {name} {sequence} {loop} />
      {:else}
        <Event {id} {name} {sequence} />
      {/if}
    {/each}
    <button
      title="Add Event"
      on:click={() =>
        events.add({
          name: `Event${eventIndex++}`,
          sequence: [],
        })}>🧨</button
    >
    <button
      title="Add Loop Event"
      on:click={() =>
        events.add({
          name: `LoopEvent${loopEventIndex++}`,
          sequence: [],
          loop: {
            start: 0,
            end: 16,
            iterationNumber: 1,
            iterationType: "increment",
            timeGap: 50,
            reverse: false,
          },
        })}>🔄🧨</button
    >
  </div>
  <div id="palette">
    <h4>Color Palette 🎨</h4>
    <!-- TODO: Warn the player to pick the color first -->
    <input type="color" bind:value={color} />
    <button on:click={() => colorPalette.addColor(color)} title="Add Color"
      >🎨</button
    >
    <div class="palette">
      {#each [...$colorPalette] as color}
        <div class="color-container">
          <div
            class="color"
            class:isDefault={color == defaultBackground}
            style="background-color: {color};"
            on:click={() => setDefaultBackground(color)}
          />
          <!-- TODO: Change all ❌'s to something appropriate  -->
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
