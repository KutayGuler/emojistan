<script lang="ts">
  // import autoAnimate from "@formkit/auto-animate";
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte/internal";
  import { invertColor } from "../utils/invertColor";
  import {
    collisions,
    events,
    conditions,
    colorPalette,
    statics,
    currentEmoji,
  } from "../store";
  import Push from "../components/rules/Push.svelte";
  import Merge from "../components/rules/Merge.svelte";
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

  function addColor() {
    if (color == "") {
      // TODO: Warn the player to pick the color first
    } else {
      colorPalette.addColor(color);
    }
  }

  function removeColor(color: string) {
    colorPalette.removeColor(color);
    if (!$colorPalette.has(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
    }
  }

  console.log([...$conditions]);
</script>

<section class="noselect rules">
  <div id="palette">
    <p title="Click on any color to set it as the default background color">
      Color Palette 🎨
    </p>
    <input type="color" bind:value={color} />
    <button on:click={addColor}>🎨</button>
    <div>
      {#each [...$colorPalette] as color}
        <div class="color-container">
          <div
            class="color"
            class:isDefault={color == defaultBackground}
            style="background-color: {color};"
            on:click={() => setDefaultBackground(color)}
          />
          <!-- TODO: Figure out how to keep X's position same while the component is getting longer -->
          <button class="remove-color" on:click={() => removeColor(color)}>
            ❌
          </button>
        </div>
      {/each}
    </div>
  </div>
  <div id="statics">
    <!-- TODO: Add tooltip to statics -->
    <p>Static Items 🗿</p>
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
  <!-- TODO: Add tooltip to collisions -->
  <div id="pushes">
    <p title="Objects will bump into each other by default">Pushes 💨</p>
    {#each [...$collisions, ["", ["", "", "push"]]].filter( ([k, v]) => v.includes("push") ) as [id, rule] (id)}
      <div transition:scale|local animate:flip>
        {#if id == ""}
          <button
            class="collision-btn"
            on:click={() => collisions.add(["", "", "push"])}>💨</button
          >
        {:else}
          <Push {id} {rule} />
        {/if}
      </div>
    {/each}
  </div>
  <div id="merges">
    <p title="Objects will bump into each other by default">Merges 💫</p>
    {#each [...$collisions, ["", ["", "", ""]]].filter(([k, v]) => !v.includes("push")) as [id, rule] (id)}
      <div transition:scale|local animate:flip>
        {#if id == ""}
          <button
            class="collision-btn"
            on:click={() => collisions.add(["", "", ""])}>💫</button
          >
        {:else}
          <Merge {id} {rule} />
        {/if}
      </div>
    {/each}
  </div>
  <div id="conditions">
    <p>Conditions ❓</p>
    {#each [...$conditions, ["", {}]] as [id, { a, b, _b, eventID }] (id)}
      <div transition:scale|local animate:flip>
        {#if id == ""}
          <button
            class="condition-btn"
            on:click={() =>
              conditions.add({
                a: "playerBackground",
                b: "",
                _b: "any",
                eventID: "",
              })}
            >❓
          </button>
        {:else}
          <Condition {id} {a} {b} {_b} {eventID} />
        {/if}
      </div>
    {/each}
  </div>
  <div id="events">
    <p>Events 🧨</p>
    {#each [...$events, ["", {}]] as [id, { name, sequence, loop }] (id)}
      <div transition:scale|local animate:flip>
        {#if id == ""}
          <div class="event-btn-container">
            <button
              class="event-btn"
              on:click={() =>
                events.add({
                  name: `Event${eventIndex++}`,
                  sequence: [],
                })}>🧨</button
            >
            <button
              class="event-btn"
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
        {:else if loop != undefined}
          <LoopEvent {id} {name} {sequence} {loop} />
        {:else}
          <Event {id} {name} {sequence} />
        {/if}
      </div>
    {/each}
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

  #palette {
    width: 100%;
  }

  .color-container,
  .color {
    --size: clamp(16px, 8vw, 64px);
    --br: calc(var(--size) / 8);
    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: var(--br);
    margin: 1%;
  }

  .color-container {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    /* gap: 2.5%; */
  }

  .color {
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

  .collision-btn,
  .condition-btn {
    color: white;
  }

  .collision-btn {
    border-color: #3a96dd;
    background: #e9f3fb;
  }

  .collision-btn:hover {
    background: #3a96dd;
  }

  .condition-btn {
    border-color: #644292;
    background: #cfc0e3;
  }

  .condition-btn:hover {
    background: #644292;
  }

  .event-btn {
    border-color: #ffc83d;
    background: #fff3d6;
  }

  .event-btn:hover {
    background: #ffc83d;
  }

  .collision-btn:hover::after,
  .condition-btn:hover::after,
  .event-btn:hover::after {
    content: "++";
  }

  .collision-btn,
  .condition-btn,
  .event-btn {
    font-size: 1.5em;
    transition: 200ms ease-out;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 90%;
    padding: 5%;
    margin: 5%;
    border-radius: var(--card-br);
    border-width: 3px;
    border-style: solid;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
  }

  .event-btn-container {
    display: flex;
  }

  .event-btn {
    margin-top: 0;
    box-sizing: border-box;
  }

  @media (min-width: 1200px) {
    .rules {
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }

    #palette {
      grid-area: 1 / 1 / 2 / 2;
    }
    #statics {
      grid-area: 2 / 1 / 3 / 2;
    }
    #pushes {
      grid-area: 1 / 2 / 2 / 3;
    }
    #conditions {
      grid-area: 2 / 2 / 3 / 3;
    }
    #merges {
      grid-area: 1 / 3 / 2 / 4;
    }
    #events {
      grid-area: 2 / 3 / 3 / 4;
    }
  }
</style>
