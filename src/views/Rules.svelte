<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale, fly } from "svelte/transition";
  import { onMount } from "svelte/internal";
  import { browser } from "$app/environment";

  // DATA
  import {
    events,
    loopEvents,
    conditions,
    palette,
    statics,
    currentEmoji,
    modal,
    pushes,
    merges,
    saves,
  } from "../store";

  if (browser) {
    if ($saves.current == "") saves.useStorage();
    for (let store of [pushes, merges, events, loopEvents, palette, statics]) {
      store.useStorage($saves.current);
    }
  }

  // COMPONENTS
  import Push from "../components/Push.svelte";
  import Merge from "../components/Merge.svelte";
  import Condition from "../components/Condition.svelte";
  import Event from "../components/Event.svelte";
  import LoopEvent from "../components/LoopEvent.svelte";
  import Svelvet from "../lib/index";
  import Container from "../components/Container.svelte";
  import Spawner from "../Spawner.svelte";
  import Palette from "../components/Palette.svelte";

  const initialNodes = [
    {
      id: 1,
      position: { x: 190, y: 80 },
      component: Condition,
      bgColor: "#cfc0e3",
      borderColor: "#644292",
      width: 250,
      height: 120,
      sourcePosition: "right",
    },
    {
      id: 2,
      position: { x: 390, y: 180 },
      component: Event,
      bgColor: "#fff3d6",
      borderColor: "#ffc83d",
      width: 250,
      height: 80,
      targetPosition: "left",
    },
  ];

  const initialEdges = [
    { id: "e1-2", source: 1, target: 2, label: "edge label" },
  ];

  const flipParams = { duration: 300 };
</script>

<Palette />
<Svelvet nodes={initialNodes} edges={initialEdges} background />
<div class="flex w-1/6 flex-col justify-start">
  <!-- <Spawner /> -->
  <div class="w-3/4">
    <h4 on:click={() => modal.show("statics")}>Statics 🗿</h4>
    <button class="btn add" on:click={() => statics.add($currentEmoji)}>
      [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
    </button>
    {#each [...$statics] as item (item)}
      <div transition:scale|local={flipParams} animate:flip={flipParams}>
        <button class="btn remove" on:click={() => statics.remove(item)}
          >{item}</button
        >
      </div>
    {/each}
  </div>
</div>

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

  h3 {
    opacity: 50%;
  }

  h3:hover,
  h4:hover,
  .currentRule {
    transform: scale(125%);
  }

  h3:hover,
  .currentRule {
    opacity: 100%;
  }

  .isDefault::after {
    content: "🌍";
    color: white;
    mix-blend-mode: difference;
  }

  /* BUTTONS */

  .color > button {
    transition: 50ms ease-out;
  }

  .color > button:hover {
    transform: scale(125%);
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
</style>
