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
    weapons,
    throwables,
  } from "../store";

  // COMPONENTS
  import Push from "../components/rules/Push.svelte";
  import Merge from "../components/rules/Merge.svelte";
  import Condition from "../components/rules/Condition.svelte";
  import Event from "../components/rules/Event.svelte";
  import LoopEvent from "../components/rules/LoopEvent.svelte";
  import Weapon from "../components/rules/Weapon.svelte";
  import Throwable from "../components/rules/Throwable.svelte";

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
    cp.remove(color);
    if (!$cp.has(defaultBackground)) {
      r.style.setProperty("--default-background", "#faebd7");
      r.style.setProperty("--inverted", "#ff3e00");
      defaultBackground = "#faebd7";
    }
  }

  function pickedColorChanged() {
    r.style.setProperty("--picked-color", pickedColor);
  }

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

  let index = 2;
  let types = ["Physics ⚛️", "Triggers 🔔", "Misc 🔮"];

  const flipParams = { duration: 300 };
</script>

<!-- TODO: Do not apply to other items until this one is bug free -->
<!-- TODO: Check stackblitz solution to animation problem -->

<!-- draggable={id != ""}
  on:dragstart={(event) => dragstart(event, id)}
  ondragover={id != "" ? "return false" : "return true"}
  on:drop|preventDefault={(event) => drop(event, id)}
  on:dragenter={() => (hovering = i)}
  class:is-active={hovering === i} -->

<section
  class="noselect px-1/4 relative flex h-[90%] w-full flex-col gap-2 overflow-auto px-40 pb-10"
>
  <div class="mt-8 mb-16 flex flex-row justify-center gap-16">
    {#each types as type, i}
      <h3 on:click={() => (index = i)}>{type}</h3>
    {/each}
  </div>
  {#key index}
    <div in:fly>
      {#if index == 0}
        <!-- PHYSICS -->
        <div class="flex w-full">
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
            <h4 on:click={() => modal.show("merges")}>Merges 🌌</h4>
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
                    >🌌</button
                  >
                {:else if typeof id === "string" && Array.isArray(rule)}
                  <Merge {id} {rule} />
                {/if}
              </div>
            {/each}
          </div>
          <!-- STATICS -->
          <div class="flex-1">
            <h4 on:click={() => modal.show("statics")}>Statics 🗿</h4>
            <div class="flex flex-wrap items-start justify-start">
              {#each [...$statics, ""] as item (item)}
                <div
                  transition:scale|local={flipParams}
                  animate:flip={flipParams}
                >
                  {#if item == ""}
                    <button
                      class="statics-add-btn"
                      on:click={() => statics.add($currentEmoji)}
                    >
                      [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
                    </button>
                  {:else}
                    <button
                      class="statics-btn"
                      on:click={() => statics.remove(item)}>{item}</button
                    >
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if index == 1}
        <!-- TRIGGERS -->
        <div class="flex w-full">
          <!-- CONDITIONS -->
          <div class="flex-1">
            <h4 on:click={() => modal.show("conditions")}>Conditions ❓</h4>
            {#each [...$conditions, ["", {}]] as [id, { a, b, _b, eventID }] (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
              >
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
          <div class="flex-1">
            <h4 on:click={() => modal.show("events")}>Events 🧨</h4>
            {#each [...$events, ["", {}]] as [id, { name, sequence }] (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
              >
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
          <div class="flex-1">
            <h4 on:click={() => modal.show("events")}>Loop Events 🔄🧨</h4>
            {#each [...$loopEvents, ["", {}]] as [id, { name, sequence, loop }] (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
              >
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
        </div>
      {:else if index == 2}
        <!-- MISC -->
        <div class="flex w-full">
          <!-- WEAPONS -->
          <div class="flex-1">
            <!-- TODO: Change to proper modal -->
            <h4 on:click={() => modal.show("palette")}>Weapons 🔫</h4>
            {#each [...$weapons, ["", { order: 1000 }]] as [id, { order }], i (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
                style:order
              >
                {#if id == ""}
                  <button
                    class="btn weapon-btn"
                    on:click={() => weapons.add({ order: 1000 })}>🔫</button
                  >
                {:else}
                  <Weapon {id} />
                {/if}
              </div>
            {/each}
          </div>
          <!-- THROWABLES -->
          <div class="flex-1">
            <!-- TODO: Change to proper modal -->
            <h4 on:click={() => modal.show("palette")}>Throwables 🥏</h4>

            {#each [...$throwables, ["", { order: 1000 }]] as [id, { order }], i (id)}
              <div
                class="flex items-center justify-center"
                transition:scale|local={flipParams}
                animate:flip={flipParams}
                style:order
              >
                {#if id == ""}
                  <button
                    class="btn throwable-btn"
                    on:click={() => throwables.add({ order: 1000 })}>🥏</button
                  >
                {:else}
                  <Throwable {id} />
                {/if}
              </div>
            {/each}
          </div>
          <div class="flex-1">
            <!-- TODO: Add defaultBackground functionality -->
            <h4 on:click={() => modal.show("palette")}>Palette 🎨</h4>

            <div class="flex flex-wrap items-start justify-start">
              {#each [...$cp, ""] as color (color)}
                <div
                  transition:scale|local={flipParams}
                  animate:flip={flipParams}
                >
                  {#if color == ""}
                    <button
                      class="statics-add-btn relative"
                      style:border-color={pickedColor}
                      on:click={() => cp.add(pickedColor)}
                      >🎨
                      <input
                        class="absolute -bottom-full h-full w-full"
                        type="color"
                        bind:value={pickedColor}
                        on:change={pickedColorChanged}
                      />
                    </button>
                  {:else}
                    <button
                      style:background={color}
                      style:color
                      class="statics-btn"
                      on:click={() => removeColor(color)}>_</button
                    >
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/key}
</section>

<style>
  :root {
    --picked-color: black;
  }

  h3 {
    font-size: 2rem;
    cursor: pointer;
  }

  h4 {
    font-size: 1.5rem;
    cursor: help;
  }

  h4,
  h3 {
    text-align: center;
    transition: 200ms ease-out;
  }

  h3:hover,
  h4:hover {
    transform: scale(125%);
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

  .weapon-btn {
    border-color: #13a10e;
    background: #89f485;
  }

  .weapon-btn:hover {
    background: #13a10e;
  }

  .throwable-btn {
    border-color: #f7630c;
    background: #fee2d2;
  }

  .throwable-btn:hover {
    background: #f7630c;
  }

  /* .is-active {
    background-color: #3273dc;
    color: #fff;
  } */
</style>
