<script lang="ts">
  // VIEWS
  import Play from "../views/Play.svelte";
  import Editor from "../views/Editor.svelte";
  import Rules from "../views/Rules.svelte";

  import { emojis } from "../emojis";
  import {
    currentEmoji,
    inventory,
    currentItem,
    currentColor,
    colorPalette,
  } from "../store";

  let filter = "";

  let viewIndex = 2;
  let inventoryIndex = 0;
  $currentItem = $inventory[inventoryIndex];

  let views = [
    { component: Play, emoji: "🎬", title: "Play" },
    { component: Editor, emoji: "🏗️", title: "Editor" },
    { component: Rules, emoji: "📜", title: "Rules" },
  ];

  let [x, y] = [0, 0];

  function setCursorEmoji(e: MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Escape") {
      $currentEmoji = "";
      $currentColor = "";
    } else if (viewIndex == 0 && +e.key >= 1 && +e.key <= 4) {
      inventoryIndex = +e.key - 1;
      $currentItem = $inventory[inventoryIndex];
    }
  }

  let asideStyle = "";
  let interactiveStyle = "";

  function changeView(i: number) {
    viewIndex = i;
    if (i == 0) {
      interactiveStyle = "width: 100vw;";
      asideStyle = "width: 0; padding: 0; border-left: 0;";
    } else {
      asideStyle = "";
      interactiveStyle = "";
    }
  }

  function pickEmoji(emoji: string) {
    $currentEmoji = emoji == $currentEmoji ? "" : emoji;
  }

  function pickColor(color: string) {
    $currentColor = color == $currentColor ? "" : color;
  }

  // TODO: Find what is causing the jank

  let innerWidth: number;
  let innerHeight: number;
</script>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />
<div
  class="cursor"
  style="transform: translate({x + 75 >= innerWidth ? x - 30 : x + 15}px,
   {y + 30 >= innerHeight ? y - 30 : y}px);"
  style:background={$currentColor}
>
  {$currentEmoji}
</div>

<main>
  <div class="playground" on:mousemove={setCursorEmoji}>
    <div id="interactive" style={interactiveStyle}>
      <div id="toolbox">
        <!-- TODO: Tooltip for shortcuts -->
        <!-- <div>
          <h4>Shortcuts</h4>
          <p>Esc - Deselect emoji/color</p>
        </div> -->
        <h4>{views[viewIndex].title}</h4>
        <div class="view noselect">
          {#each views as view, i}
            <div
              on:click={() => changeView(i)}
              class:currentView={viewIndex == i}
            >
              {view.emoji}
            </div>
          {/each}
        </div>
      </div>
      {#if viewIndex == 1}
        <Editor>
          <div class="palette">
            <p
              title={$colorPalette.size == 0
                ? "Create a palette in Rules tab color your map!"
                : ""}
              on:click={() => ($currentColor = "")}
              style:opacity={$colorPalette.size == 0 ? "50%" : "100%"}
            >
              🎨{$colorPalette.has($currentColor) ? "" : "🖌️"}
            </p>
            {#each [...$colorPalette] as c}
              <div
                class="color"
                class:currentColor={c == $currentColor}
                style:background={c}
                on:click={() => pickColor(c)}
              />
            {/each}
          </div>
        </Editor>
      {:else}
        <svelte:component this={views[viewIndex].component} />
      {/if}
    </div>
    <div id="aside-container" class="noselect" style={asideStyle}>
      <input type="text" placeholder="search" bind:value={filter} />
      <div id="emoji-container">
        {#each Object.keys(emojis) as category}
          {#if emojis[category].some((item) => item.name.includes(filter))}
            <h4>{category}</h4>
          {/if}
          <div class="flex">
            {#each emojis[category] as { emoji, unicode_version, name }}
              {#if name.includes(filter) && +unicode_version < 13}
                <div
                  class:selected={$currentEmoji == emoji}
                  on:click={() => pickEmoji(emoji)}
                  title={name}
                >
                  {emoji}
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .cursor {
    width: 2.5vw;
    height: 2.5vw;
    position: absolute;
    z-index: 99;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100vh;
    box-sizing: border-box;
  }

  .playground {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
    width: 100%;
  }

  .playground > div {
    height: 100vh;
    width: 75%;
    box-sizing: border-box;
  }

  #toolbox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 1.5rem;
    background-color: antiquewhite;
    border-bottom: 2px solid black;
    box-sizing: border-box;
    transition: 200ms ease-out;
    height: 5%;
  }

  .view {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .view > div:hover {
    transition: 200ms ease-out;
    cursor: pointer;
  }

  #toolbox h4,
  p {
    font-size: 1rem;
    padding: 0;
    margin: 0;
  }

  .currentView {
    font-size: 2rem;
  }

  #interactive,
  #aside-container {
    transition: 200ms ease-out;
  }

  #aside-container {
    background-color: var(--secondary);
    width: 25%;
    padding: 0.5rem;
    border-left: 2px solid black;
    overflow-y: auto;
  }

  #aside-container .flex {
    display: flex;
    flex-wrap: wrap;
  }

  .selected {
    border: 2px solid red;
  }

  .color {
    width: 50px;
    height: 50px;
  }

  .palette {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .currentColor::after {
    content: "🖌️";
    color: white;
    mix-blend-mode: difference;
  }
</style>
