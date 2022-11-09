<script lang="ts">
  // TODO: if in this route and currentSave == "" then redirect to home
  // TODO: Switch to IndexedDB

  // VIEWS
  import Play from "../../views/Play.svelte";
  import Editor from "../../views/Editor.svelte";
  import Rules from "../../views/Rules.svelte";

  // DATA
  import { emojis } from "../../emojis";
  import {
    quickAccess,
    currentEmoji,
    currentColor,
    palette,
  } from "../../store";

  import { onMount } from "svelte";
  // import { redirect } from "@sveltejs/kit";

  let loading = true;
  let interactiveDiv;

  onMount(() => {
    console.log(interactiveDiv.offsetWidth, interactiveDiv.offsetHeight);
    let timer = setTimeout(() => (loading = false), 2000);
    // if (localStorage.getItem("currentSave") == "") {
    //   throw redirect(307, "/");
    // }
    return () => clearTimeout(timer);
  });

  let filter = "";

  // quickAcess edit mode
  let editMode = false;

  let viewIndex = 1;

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
    console.log($currentEmoji);
  }

  function pickColor(color: string) {
    $currentColor = color == $currentColor ? "" : color;
  }

  let innerWidth: number;
  let innerHeight: number;
</script>

<svelte:head>
  <title>Game</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />
<div
  class:cursor={$currentEmoji != ""}
  style={$currentEmoji != "" ? `translate: ${x + 15}px ${y}px` : ""}
  style:display={x + 85 >= innerWidth || y + 85 >= innerHeight ? "none" : ""}
  style:background={$currentColor}
>
  {$currentEmoji}
</div>

<main class="noselect">
  <div class="playground" on:mousemove={setCursorEmoji}>
    <div id="interactive" style={interactiveStyle} bind:this={interactiveDiv}>
      <nav
        class="relative box-border flex h-16 items-center justify-center border-b-2 bg-amber-50 text-lg"
      >
        <p
          title="Main Menu"
          class="absolute left-4 duration-200 ease-out hover:scale-125 hover:before:content-['🔙']"
        >
          🏝️
        </p>
        <p>{views[viewIndex].title}</p>
        <span>
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
            {#each [...$palette] as c}
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
    <div id="aside-container" style={asideStyle}>
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
            <h4 class="pt-16 pb-4">{category}</h4>
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
  @keyframes idle {
    100% {
      transform: translateY(-20px);
    }
  }

  .cursor {
    width: 2.5vw;
    height: 2.5vw;
    position: absolute;
    z-index: 3;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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

  nav > span {
    position: absolute;
    right: 24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    gap: 15%;
  }

  nav > span > span {
    transition: 200ms ease-out;
    opacity: 50%;
  }

  nav p {
    font-size: 2rem;
    padding: 0;
    margin: 0;
  }

  nav > span > span:hover,
  .currentView {
    opacity: 100%;
    transform: scale(150%);
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

  #aside-container .flex > div {
    transition: 50ms ease-out;
  }

  #aside-container .flex > div:hover {
    scale: 1.5;
  }

  .selected {
    border: 2px solid red;
  }

  .color {
    width: 50px;
    height: 50px;
    transition: 50ms ease-out;
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
