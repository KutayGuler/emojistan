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
<script>
  import { findOrCreateStore, contextMenu } from "$lib/stores/store";

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

  function spawnIf() {
    let ids = $nodesStore.map((n) => n.id);
    $nodesStore.push({
      id: Math.max(...ids) + 1,
      bgColor: "white",
      position: { x: 100, y: 100 },
      width: 100,
      height: 100,
      data: { label: "If statement" },
    });
    $nodesStore = $nodesStore;
  }

  function spawnEvent() {}
  function spawnLoopEvent() {}

  function spawnEmojiContainer() {}
  function spawnDoubleEmojiContainer() {}

  function spawnStatics() {
    // can only be spawned once
  }

  function spawnPalette() {
    // can only be spawned once
  }

  let menuItems = [
    {
      name: "spawnEmojiContainer",
      onClick: spawnEmojiContainer,
      displayText: "Emoji Container",
    },
    {
      name: "spawnEmojiContainer",
      onClick: spawnDoubleEmojiContainer,
      displayText: "Double Emoji Container",
    },
    {
      name: "spawnIf",
      onClick: spawnIf,
      displayText: "Condition",
    },
    {
      name: "spawnEvent",
      onClick: spawnEvent,
      displayText: "Event",
    },
    {
      name: "spawnEvent",
      onClick: spawnEvent,
      displayText: "Loop Event",
    },
    {
      name: "hr",
    },
    {
      name: "spawnStatics",
      onClick: spawnStatics,
      displayText: "Statics",
    },
    {
      name: "spawnPalette",
      onClick: spawnPalette,
      displayText: "Palette",
    },
  ];
</script>

{#if $contextMenu}
  <nav
    use:getContextMenuDimension
    style="position: absolute; top:{pos.y}px; left:{pos.x}px"
  >
    <div class="navbar" id="navbar">
      <ul>
        {#each menuItems as item}
          {#if item.name == "hr"}
            <hr />
          {:else}
            <li>
              <button on:click={item.onClick}>{item.displayText}</button>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </nav>
{/if}

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
