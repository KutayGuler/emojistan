<script lang="ts">
  // VIEWS
  import Play from "../views/Play.svelte";
  import Editor from "../views/Editor.svelte";
  import Rules from "../views/Rules.svelte";

  // COMPONENTS
  import Modal from "../components/tutorial/Modal.svelte";

  // DATA
  import { emojis } from "../emojis";
  import {
    quickAccess,
    currentEmoji,
    currentColor,
    colorPalette,
  } from "../store";

  let filter = "";

  // quickAcess edit mode
  let editMode = false;

  let viewIndex = 2;

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

  let innerWidth: number;
  let innerHeight: number;
</script>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />
<div
  class:cursor={$currentEmoji != ""}
  style:display={x + 85 >= innerWidth || y + 85 >= innerHeight ? "none" : ""}
  style="transform: translate({x + 15}px, {y}px);"
  style:background={$currentColor}
>
  {$currentEmoji}
</div>

<Modal />
<main>
  <div class="playground" on:mousemove={setCursorEmoji}>
    <div id="interactive" style={interactiveStyle}>
      <nav>
        <!-- TODO: Tooltip for shortcuts (Shortcuts.svelte)-->
        <!-- <div>
          <h4>Shortcuts</h4>
          <p>Esc - Deselect emoji/color</p>
        </div> -->
        <p>{views[viewIndex].title}</p>
        <span class="noselect">
          {#each views as view, i}
            <span
              on:click={() => changeView(i)}
              class:currentView={viewIndex == i}
            >
              {view.emoji}
            </span>
          {/each}
        </span>
      </nav>
      {#if viewIndex == 1}
        <Editor>
          <div class="palette">
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
      <input id="search" type="text" placeholder="search" bind:value={filter} />
      <div id="emoji-container">
        <h4>
          Quick Access <button on:click={() => (editMode = !editMode)}
            >Edit {editMode ? "❌" : ""}</button
          >
        </h4>
        {#if editMode}
          <span
            ><button on:click={() => quickAccess.add($currentEmoji)}
              >Add ( {$currentEmoji || "____"} )</button
            ><button on:click={() => quickAccess.remove($currentEmoji)}
              >Remove ( {$currentEmoji || "____"} )</button
            ></span
          >
        {/if}
        <div class="flex">
          {#each [...$quickAccess] as emoji}
            <div
              class:selected={$currentEmoji == emoji}
              on:click={() => pickEmoji(emoji)}
            >
              {emoji}
            </div>
          {/each}
        </div>
        {#each Object.keys(emojis) as category}
          {#if emojis[category].some((item) => item.name.includes(filter))}
            <h4>{category}</h4>
          {/if}
          <div class="flex">
            {#each emojis[category] as { emoji, name }}
              {#if name.includes(filter)}
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
    z-index: 3;
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

  nav {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    background-color: antiquewhite;
    border-bottom: 2px solid black;
    box-sizing: border-box;
    height: 5%;
  }

  nav > span {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  nav > span > span {
    transition: 200ms ease-out;
  }

  nav p {
    font-size: 2rem;
    padding: 0;
    margin: 0;
  }

  .currentView {
    font-size: 2rem;
  }

  #search {
    width: 90%;
    margin-right: 10%;
    margin-top: 10%;
  }

  #search,
  #emoji-container * {
    font-size: 1.25rem;
  }

  #emoji-container h4 {
    font-size: 1.75rem;
  }

  #interactive {
    width: var(--interactive-container-size);
  }

  #interactive,
  #aside-container {
    transition: 200ms ease-out;
  }

  #aside-container {
    background-color: var(--secondary);
    width: var(--emoji-container-size);
    padding: 0.5rem;
    border-left: 2px solid black;
    overflow-y: auto;
  }

  #aside-container .flex {
    display: flex;
    flex-wrap: wrap;
  }

  /* EMOJI */
  /* .flex > div {
    font-family: emoji;
  } */

  #aside-container .flex > div:hover {
    transform: scale(150%);
    transition: 50ms;
  }

  .selected {
    border: 2px solid red;
  }

  .color {
    width: 50px;
    height: 50px;
    transition: 200ms ease-out;
  }

  .color:hover {
    transform: scale(125%);
  }

  .currentColor {
    transition: 200ms;
    transform: scale(125%);
  }

  .palette {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* column-gap: 10%; */
  }
</style>
