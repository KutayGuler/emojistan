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
    palette,
    type TCondition,
    type TEvent,
    type TLoopEvent,
  } from "./store";
  import { findOrCreateStore, contextMenu } from "$lib/stores/store";
  import type { SvelteComponent } from "svelte";
  import Event from "./components/Event.svelte";
  import LoopEvent from "./components/LoopEvent.svelte";
  import Palette from "./components/Palette.svelte";
  import Container from "./components/Container.svelte";

  export let key;

  // pos is cursor position when right click occur
  let pos = { x: 0, y: 0 };
  // menu is dimension (height and width) of context menu
  let menu = { h: 0, y: 0 };
  // browser/window dimension (height and width)
  let browser = { h: 0, y: 0 };

  function rightClickContextMenu(e) {
    $contextMenu = true;
    browser = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
    pos = {
      x: e.clientX,
      y: e.clientY,
    };
    // If bottom part of context menu will be displayed
    // after right-click, then change the position of the
    // context menu. This position is controlled by `top` and `left`
    // at inline style.
    // Instead of context menu is displayed from top left of cursor position
    // when right-click occur, it will be displayed from bottom left.
    if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
    if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
  }
  function onPageClick(e) {
    // To make context menu disappear when
    // mouse is clicked outside context menu
    $contextMenu = false;
  }
  function getContextMenuDimension(node) {
    // This function will get context menu dimension
    // when navigation is shown => showMenu = true
    let height = node.offsetHeight;
    let width = node.offsetWidth;
    menu = {
      h: height,
      w: width,
    };
  }

  const svelvetStore = findOrCreateStore(key);
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
      name: "Emoji Container",
      onClick: spawnEmojiContainer,
    },
    {
      name: "Double Emoji Container",
      onClick: spawnDoubleEmojiContainer,
    },
    {
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

  // TODO: Palette and statics should be seperate
</script>

{#if $contextMenu}
  <nav
    use:getContextMenuDimension
    style="position: absolute; top:{pos.y}px; left:{pos.x}px"
  >
    <div class="navbar" id="navbar">
      <ul>
        {#each menuItems as { name, onClick }}
          {#if name == "hr"}
            <hr />
          {:else}
            <li>
              <button on:click={onClick}>{name}</button>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </nav>
{/if}

<!-- TODO: Take context menu to right side -->

<svelte:window
  on:contextmenu|preventDefault={rightClickContextMenu}
  on:click={onPageClick}
/>

<style>
  * {
    padding: 0;
    margin: 0;
    z-index: 5;
  }
  .navbar {
    display: inline-flex;
    border: 1px #999 solid;
    width: 170px;
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    flex-direction: column;
  }
  .navbar ul {
    margin: 6px;
  }
  ul li {
    padding-left: 8px;
    display: block;
    list-style-type: none;
    width: 1fr;
  }
  ul li button {
    font-size: 1rem;
    color: #222;
    width: 100%;
    height: 30px;
    text-align: left;
    border: 0px;
    background-color: #fff;
  }
  ul li button:hover {
    color: #000;
    text-align: left;
    border-radius: 5px;
    background-color: #eee;
  }
  :global(ul li button.info:hover) {
    color: navy;
  }
  hr {
    border: none;
    border-bottom: 1px solid #ccc;
    margin: 5px 0px;
  }
</style>
