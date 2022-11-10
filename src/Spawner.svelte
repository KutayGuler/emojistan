<!-- 
Github @dukenmarga, July 2022
Context Menu is small menu that displayed when user right-click the mouse on browser.
Think of it as a way to show Refresh option on Microsoft Windows when right-click on desktop.
Known bug:
    - If the browser loads the content for the first time, showMenu set to false.
    Hence, we cannot get menu.h and menu.y dimension, since context menu has not been available at DOM.
    The first right click will not shown properly when right-click occurs around the edge (bottom part
    and right part) of the browser.

Inspired from: Context Menu https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0
-->
<script lang="ts">
  import Condition from "./components/Condition.svelte";
  import {
    conditions,
    events,
    loopEvents,
    type TCondition,
    type TEvent,
    type TLoopEvent,
  } from "./store";
  import { findOrCreateStore } from "$lib/stores/store";
  import type { SvelteComponent } from "svelte";
  import Event from "./components/Event.svelte";
  import LoopEvent from "./components/LoopEvent.svelte";
  import Container from "./components/Container.svelte";
  import { _key as key } from "$lib/stores/store";

  const svelvetStore = findOrCreateStore($key);
  const { nodesStore } = svelvetStore;

  const colors = {
    condition: ["#cfc0e3", "#644292"],
    event: ["#f6fafd", "#ffc83d"],
  };

  function spawn<T>(
    name: string,
    component: SvelteComponent,
    store: any,
    value: T,
    receiver = false
  ) {
    let id = Math.max(...$nodesStore.map((n) => n.id)) + 1;
    let obj = {
      id,
      component,
      position: { x: 190, y: 80 },
      width: 250,
      height: 120,
    };

    Object.assign(
      obj,
      receiver ? { targetPosition: "left" } : { sourcePosition: "right" }
    );
    Object.assign(obj, {
      bgColor: colors[name][0],
      borderColor: colors[name][1],
    });

    store.add(id, value);
    $nodesStore.push(obj);
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
  }

  function spawnEmojiContainer() {
    let id = Math.max(...$nodesStore.map((n) => n.id)) + 1;
    let obj = {
      id,
      component: Container,
      position: { x: 190, y: 80 },
      width: 50,
      height: 50,
      borderColor: "#40b3ff",
      sourcePosition: "right",
    };

    // Object.assign(
    //   obj,
    //   receiver ? { targetPosition: "left" } : { sourcePosition: "right" }
    // );

    $nodesStore.push(obj);
    $nodesStore = $nodesStore; // NECESSARY FOR REACTIVITY
    console.log($nodesStore);
  }
  function spawnDoubleEmojiContainer() {}

  let menuItems = [
    {
      id: "ec",
      name: "Emoji Container",
      onClick: spawnEmojiContainer,
    },
    {
      id: "dec",
      name: "Double Emoji Container",
      onClick: spawnDoubleEmojiContainer,
    },
    {
      id: "c",

      name: "Condition",
      onClick: () =>
        spawn<TCondition>("condition", Condition, conditions, {
          a: "playerBackground",
          b: "",
          _b: "any",
          eventID: "",
        }),
    },
    {
      id: "e",

      name: "Event",
      onClick: () =>
        spawn<TEvent>(
          "event",
          Event,
          events,
          {
            sequence: [],
          },
          true
        ),
    },
    {
      id: "le",

      name: "Loop Event",
      onClick: () =>
        spawn<TLoopEvent>(
          "event",
          LoopEvent,
          loopEvents,
          {
            sequence: [],
            loop: {
              start: 0,
              end: 16,
              iterationNumber: 1,
              iterationType: "increment",
              timeGap: 50,
              reverse: false,
            },
          },
          true
        ),
    },
  ];
</script>

<h4 on:click={() => modal.show("statics")}>Spawner 🗿</h4>
<nav class="rounded-lg border border-purple-400 p-1">
  <ul>
    {#each menuItems as { name, onClick }}
      <li class="h-8 w-full">
        <button
          class="add w-36 rounded-md px-2 text-left hover:bg-slate-200"
          on:click={onClick}>{name}</button
        >
      </li>
    {/each}
  </ul>
</nav>

<style>
</style>
