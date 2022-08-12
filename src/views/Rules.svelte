<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte/internal";

  // UTILS
  import { invertColor } from "../utils/invertColor";

  // DATA
  import {
    events,
    conditions,
    colorPalette as cp,
    statics,
    currentEmoji,
    modal,
    pushes,
    merges,
  } from "../store";

  // COMPONENTS
  import Push from "../components/rules/Push.svelte";
  import Merge from "../components/rules/Merge.svelte";
  import Condition from "../components/rules/Condition.svelte";
  import Event from "../components/rules/Event.svelte";
  import LoopEvent from "../components/rules/LoopEvent.svelte";

  let r: any;
  let pickedColor = "#000000";
  let defaultBackground = "#faebd7";
  let eventIndex = 1;
  let loopEventIndex = 1;

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

  // TODO: Divide rules into Physics and Triggers
  let hovering: any = false;

  const drop = (event: any, target: any) => {
    console.log("drop");
    event.dataTransfer.dropEffect = "move";
    const start = event.dataTransfer.getData("text/plain");

    // @ts-expect-error
    let prevOrder = $pushes.get(start).order;
    // @ts-expect-error
    let nextOrder = $pushes.get(target).order;

    // @ts-expect-error
    pushes.updateValue(start, "order", nextOrder);
    // @ts-expect-error
    pushes.updateValue(target, "order", prevOrder);

    hovering = null;
  };

  const dragstart = (event: any, i: any) => {
    console.log("drag start");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
    const start = i;
    event.dataTransfer.setData("text/plain", start);
  };

  // TODO: Seperate pushes and merges
</script>

<section class="noselect rules">
  <div id="palette" style:background={defaultBackground}>
    <span>
      <h4 on:click={() => modal.show("statics")}>Palette</h4>
      <input
        type="color"
        bind:value={pickedColor}
        on:change={pickedColorChanged}
      />
    </span>
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
          <button class="remove-color" on:click={() => removeColor(color)}>
            ❌
          </button>
        </div>
      {/each}
    </div>
  </div>
  <div id="statics">
    <h4 on:click={() => modal.show("statics")}>Statics 🗿</h4>
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
  <!-- TODO: Do not apply to other items until this one is bug free -->
  <!-- TODO: Change to ul and li -->
  <!-- TODO: Try autoanimate (how will it keep track of order?)-->
  <div id="pushes">
    <h4 on:click={() => modal.show("pushes")}>Pushes 💨</h4>
    {#each [...$pushes, ["", { rule: ["", "", "push"], order: 1000 }]] as [id, { rule, order }], i (id)}
      <div
        transition:scale|local
        animate:flip
        style:order
        draggable={id != ""}
        on:dragstart={(event) => dragstart(event, id)}
        ondragover={id != "" ? "return false" : "return true"}
        on:drop|preventDefault={(event) => drop(event, id)}
        on:dragenter={() => (hovering = i)}
        class:is-active={hovering === i}
      >
        {#if id == ""}
          <button
            class="collision-btn"
            on:click={() => pushes.add({ rule: ["", "", "push"], order: 1000 })}
            >💨</button
          >
        {:else if typeof id === "string" && Array.isArray(rule)}
          <Push {id} {rule} />
        {/if}
      </div>
    {/each}
  </div>
  <div id="merges">
    <h4 on:click={() => modal.show("merges")}>Merges 💫</h4>
    {#each [...$merges, ["", { rule: ["", "", ""] }]] as [id, { rule, order }] (id)}
      <div transition:scale|local animate:flip>
        {#if id == ""}
          <button
            class="collision-btn"
            on:click={() => merges.add({ rule: ["", "", ""] })}>💫</button
          >
        {:else if typeof id === "string" && Array.isArray(rule)}
          <Merge {id} {rule} />
        {/if}
      </div>
    {/each}
  </div>
  <div id="conditions">
    <h4 on:click={() => modal.show("conditions")}>Conditions ❓</h4>
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
    <h4 on:click={() => modal.show("events")}>Events & Loop Events 🧨</h4>
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

  .rules > div {
    display: flex;
    flex-direction: column;
  }

  h4 {
    font-size: 1.5rem;
    text-align: center;
    cursor: help;
    transition: 200ms ease-out;
  }

  h4:hover {
    transform: scale(125%);
  }

  .statics-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    height: 100%;
    padding: 25% 0;
    box-sizing: border-box;
    overflow-y: auto;
    font-size: 1.25rem;
  }

  .statics-container > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 2rem;
  }

  #statics,
  #palette {
    box-sizing: border-box;
    position: absolute;
    top: 25%;
    height: 50%;
    width: clamp(32px, 15%, 144px);
    padding: 1%;
  }

  #statics h4,
  #palette h4 {
    margin-top: 0;
  }

  #palette {
    left: 0;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  #statics {
    right: 0;
    background: #e6e6e6;
    border: 5px solid black;
    border-right: none;
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

  .is-active {
    background-color: #3273dc;
    color: #fff;
  }
</style>
