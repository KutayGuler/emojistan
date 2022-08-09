<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte/internal";

  // UTILS
  import { invertColor } from "../utils/invertColor";

  // DATA
  import {
    collisions,
    events,
    conditions,
    colorPalette as cp,
    statics,
    currentEmoji,
  } from "../store";

  // COMPONENTS
  import Push from "../components/rules/Push.svelte";
  import Merge from "../components/rules/Merge.svelte";
  import Condition from "../components/rules/Condition.svelte";
  import Event from "../components/rules/Event.svelte";
  import LoopEvent from "../components/rules/LoopEvent.svelte";

  let pickedColor = "#000000";
  let defaultBackground: string = "#faebd7";
  let r: any;
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
    cp.removeColor(color);
    if (!$cp.has(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
    }
  }

  function pickedColorChanged() {
    r.style.setProperty("--picked-color", pickedColor);
  }

  console.log([...$conditions]);
</script>

<section class="noselect rules">
  <div id="palette" style:background={defaultBackground}>
    <!-- <h4 title="Click on any color to set it as the default background color">
      🎨
    </h4> -->
    <input
      type="color"
      bind:value={pickedColor}
      on:change={pickedColorChanged}
    />
    <button class="palette-btn" on:click={() => cp.addColor(pickedColor)}
      >🎨</button
    >
    <div class="color-container">
      {#each [...$cp] as color (color)}
        <div
          class="color"
          class:isDefault={color == defaultBackground}
          style="background-color: {color};"
          on:click={() => setDefaultBackground(color)}
        >
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
    <!-- <p>Static items cannot be moved by players</p> -->
    <div
      class="statics-container noselect"
      on:click={() => statics.toggleEmoji($currentEmoji, "add")}
    >
      {#each [...$statics] as item}
        <div>
          <div>{item}</div>
          <button on:click={() => statics.toggleEmoji(item)}>❌</button>
        </div>
      {/each}
    </div>
  </div>
  <!-- TODO: Add tooltip to collisions -->
  <div id="pushes">
    <h4 title="Objects will bump into each other by default">Pushes 💨</h4>
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
    <h4 title="Objects will bump into each other by default">Merges 💫</h4>
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
    <h4>Conditions ❓</h4>
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
    <h4>Events 🧨</h4>
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
  :root {
    --picked-color: black;
  }

  input[type="color"] {
    border: 1px solid black;
    --size: clamp(16px, 8vw, 64px);
    --br: calc(var(--size) / 8);
    position: relative;
    width: 100%;
    height: var(--size);
    border-radius: var(--br);
    margin: 1%;
  }

  .rules {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 2%;
    padding: 0 25%;
    padding-bottom: 10%;
    overflow-y: auto;
    height: 95%;
    box-sizing: border-box;
    transition: 200ms ease-out;
  }

  h4 {
    font-size: 1.5rem;
    text-align: center;
  }

  .statics-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 100%;
    border: 5px solid black;
    font-size: 1.25rem;
  }

  .statics-container > div {
    display: flex;
    flex-direction: row;
  }

  #statics,
  #palette {
    position: absolute;
    top: 25%;
    height: 50%;
    width: clamp(32px, 15%, 144px);
    padding: 1%;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  #statics::before,
  #palette::before {
    top: -10%;
    position: absolute;
    font-size: 2rem;
  }

  #palette::before {
    content: "🎨";
  }

  #statics::before {
    right: 0;
    content: "🗿";
  }

  #palette {
    left: 0;
  }

  #statics {
    right: 0;
  }

  .color {
    --size: clamp(64px, 10vw, 72px);
    --br: calc(var(--size) / 8);
    min-height: 64px;
    font-size: calc(var(--size) / 2.5);
    position: relative;
    width: var(--size);
    height: var(--size);
    border-radius: var(--br);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .color > button {
    cursor: pointer;
  }

  .color-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1%;
    padding: 20% 0;
    margin-top: 15%;
    height: 65%;
    overflow-y: auto;
    direction: rtl;
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

  /* BUTTONS */

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

  .palette-btn {
    color: white;
    transition: 200ms ease-out;
    width: 100%;
    margin: 5%;
    box-sizing: border-box;
    background: whitesmoke;
  }

  .palette-btn:hover {
    background: var(--picked-color);
  }

  .palette-btn:hover::after,
  .collision-btn:hover::after,
  .condition-btn:hover::after,
  .event-btn:hover::after {
    content: "++";
  }

  .palette-btn:hover::after {
    mix-blend-mode: difference;
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
    cursor: pointer;
  }

  .event-btn-container {
    display: flex;
  }

  .event-btn {
    margin-top: 0;
    box-sizing: border-box;
  }
</style>
