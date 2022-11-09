<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale, fly } from "svelte/transition";
  import { onMount } from "svelte/internal";

  // DATA
  import {
    events,
    loopEvents,
    conditions,
    palette as cp,
    statics,
    currentEmoji,
    modal,
    pushes,
    merges,
    saves,
    // weapons,
    // throwables,
    rulesIndex,
  } from "../store";

  for (let store of [pushes, merges, events, loopEvents, cp, statics]) {
    store.useStorage($saves.current);
  }

  // COMPONENTS
  import Push from "../components/Push.svelte";
  import Merge from "../components/Merge.svelte";
  import Condition from "../components/Condition.svelte";
  import Event from "../components/Event.svelte";
  import LoopEvent from "../components/LoopEvent.svelte";
  // import Weapon from "../components/Weapon.svelte";
  // import Throwable from "../components/Throwable.svelte";
  import Svelvet from "../lib/index";
  import Container from "../components/Container.svelte";

  let eventIndex = 1;
  let loopEventIndex = 1;

  let hovering: any = false;

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
    // {
    //   id: 3,
    //   position: { x: 390, y: 180 },
    //   data: { component: Event },
    //   width: 250,
    //   height: 80,
    // },
    // {
    //   id: 4,
    //   position: { x: 390, y: 180 },
    //   data: { component: Merge },
    //   width: 125,
    //   height: 40,
    // },
    // {
    //   id: 4,
    //   position: { x: 390, y: 180 },
    //   data: { component: Condition },
    //   width: 125,
    //   height: 40,
    // },
    // {
    //   id: 5,
    //   position: { x: 390, y: 180 },
    //   data: { component: Event },
    //   width: 125,
    //   height: 40,
    // },
    // {
    //   id: 6,
    //   position: { x: 390, y: 180 },
    //   data: { component: LoopEvent },
    //   width: 125,
    //   height: 40,
    // },
  ];

  const initialEdges = [
    { id: "e1-2", source: 1, target: 2, label: "edge label" },
  ];
</script>

<Svelvet nodes={initialNodes} edges={initialEdges} background />

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

  /* .weapon-btn {
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
  } */

  /* .is-active {
    background-color: #3273dc;
    color: #fff;
  } */
</style>
