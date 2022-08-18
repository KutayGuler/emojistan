<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale, fly } from "svelte/transition";
  import { onMount } from "svelte/internal";

  // UTILS
  import { invertColor } from "../utils/invertColor";

  // DATA
  import {
    events,
    loopEvents,
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

  let index = 0;
  let types = ["Physics ⚛️", "Triggers 🔔", "Misc 🔮"];

  const flipParams = { duration: 300 };
</script>

<!-- TODO: Fix height -->
<section
  class="noselect relative flex h-full w-full flex-col gap-2 overflow-auto px-20 pb-10"
>
  <div class="mt-4 flex flex-row justify-center gap-2">
    {#each types as type, i}
      <h4 on:click={() => (index = i)}>{type}</h4>
    {/each}
  </div>

  {#key index}
    <div in:fly>
      {#if index == 0}
        <div class="flex w-full flex-row">
          <!-- PUSHES -->
          <div class="flex-1">
            <h4 on:click={() => modal.show("pushes")}>Pushes 💨</h4>
            {#each [...$pushes, ["", { rule: ["", "", "push"], order: 1000 }]] as [id, { rule, order }], i (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
                style:order
              >
                {#if id == ""}
                  <button
                    class="btn collision-btn"
                    on:click={() =>
                      pushes.add({ rule: ["", "", "push"], order: 1000 })}
                    >💨</button
                  >
                {:else if typeof id === "string" && Array.isArray(rule)}
                  <Push {id} {rule} />
                {/if}
              </div>
            {/each}
          </div>
          <!-- MERGES -->
          <div class="flex-1">
            <h4 on:click={() => modal.show("merges")}>Merges 💫</h4>
            {#each [...$merges, ["", { rule: ["", "", ""] }]] as [id, { rule, order }] (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
              >
                {#if id == ""}
                  <button
                    class="btn collision-btn"
                    on:click={() => merges.add({ rule: ["", "", ""] })}
                    >💫</button
                  >
                {:else if typeof id === "string" && Array.isArray(rule)}
                  <Merge {id} {rule} />
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {:else if index == 1}
        <div id="conditions">
          <h4 on:click={() => modal.show("conditions")}>Conditions ❓</h4>
          {#each [...$conditions, ["", {}]] as [id, { a, b, _b, eventID }] (id)}
            <div transition:scale|local={flipParams} animate:flip={flipParams}>
              {#if id == ""}
                <button
                  class="btn condition-btn"
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
        <!-- EVENTS -->
        <div>
          <h4 on:click={() => modal.show("events")}>Events 🧨</h4>
          {#each [...$events, ["", {}]] as [id, { name, sequence }] (id)}
            <div transition:scale|local={flipParams} animate:flip={flipParams}>
              {#if id == ""}
                <button
                  class="btn event-btn"
                  on:click={() =>
                    events.add({
                      name: `Event${eventIndex++}`,
                      sequence: [],
                    })}>🧨</button
                >
              {:else}
                <Event {id} {name} {sequence} />
              {/if}
            </div>
          {/each}
        </div>
        <!-- LOOP EVENTS -->
        <div>
          <h4 on:click={() => modal.show("events")}>Loop Events 🔄🧨</h4>
          {#each [...$loopEvents, ["", {}]] as [id, { name, sequence, loop }] (id)}
            <div transition:scale|local={flipParams} animate:flip={flipParams}>
              {#if id == ""}
                <button
                  class="btn event-btn"
                  on:click={() =>
                    loopEvents.add({
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
              {:else}
                <LoopEvent {id} {name} {sequence} {loop} />
              {/if}
            </div>
          {/each}
        </div>
      {:else if index == 2}
        <p>Weapons</p>
        <p>Throwables</p>
      {/if}
    </div>
  {/key}
  <!-- PALETTE -->
  <div
    class="absolute top-1/4 left-0 box-border h-1/2 w-1/6 rounded-r-xl p-2"
    style:background={defaultBackground}
  >
    <span>
      <h4 on:click={() => modal.show("palette")}>Palette</h4>
      <input
        class="w-full"
        type="color"
        bind:value={pickedColor}
        on:change={pickedColorChanged}
      />
    </span>
    <button
      class="palette-btn box-border w-full text-white duration-200 ease-out"
      on:click={() => cp.addColor(pickedColor)}>🎨</button
    >
    <div
      style="direction: rtl;"
      class="mt-5 flex h-5/6 flex-col items-center gap-2 overflow-y-auto py-5"
    >
      {#each [...$cp] as color (color)}
        <div
          class="relative flex min-h-[64px] w-full cursor-pointer flex-col items-center justify-center rounded-lg"
          class:isDefault={color == defaultBackground}
          style:background-color={color}
          on:click={() => setDefaultBackground(color)}
        >
          <button
            class="z-2 absolute top-0 right-0"
            on:click={() => removeColor(color)}
          >
            ❌
          </button>
        </div>
      {/each}
    </div>
  </div>
  <!-- TODO: set clamp values -->
  <!-- STATICS -->
  <div class="absolute top-1/4 right-0 box-border h-1/2 w-1/6 bg-slate-200 p-2">
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
  <!-- TODO: Check stackblitz solution to animation problem -->
  <!-- TODO: Make animations faster -->

  <!-- draggable={id != ""}
  on:dragstart={(event) => dragstart(event, id)}
  ondragover={id != "" ? "return false" : "return true"}
  on:drop|preventDefault={(event) => drop(event, id)}
  on:dragenter={() => (hovering = i)}
  class:is-active={hovering === i} -->
</section>

<style>
  :root {
    --picked-color: black;
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
    height: 85%;
    margin: 15% 0;
    padding: 10% 0;
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

  .isDefault::after {
    content: "🌍";
    color: white;
    mix-blend-mode: difference;
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

  .palette-btn:hover {
    background: var(--picked-color);
  }

  .palette-btn:hover::after {
    mix-blend-mode: difference;
  }

  /* .is-active {
    background-color: #3273dc;
    color: #fff;
  } */
</style>
