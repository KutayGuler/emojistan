<script lang="ts">
  // TODO: if in this route and currentSave == "" then redirect to home
  // TODO: Switch to IndexedDB

  // VIEWS
  import Play from "../../views/Play.svelte";
  import Editor from "../../views/Editor.svelte";
  import Rules from "../../views/Rules.svelte";

  // DATA
  import { emojis } from "../../emojis";
  import { quickAccess, currentEmoji, currentColor } from "../../store";

  import { onMount } from "svelte";
  // import { redirect } from "@sveltejs/kit";

  let loading = true;

  onMount(() => {
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

  function changeView(i: number) {
    viewIndex = i;
  }

  function pickEmoji(emoji: string) {
    $currentEmoji = emoji == $currentEmoji ? "" : emoji;
    console.log($currentEmoji);
  }

  let innerWidth: number;
  let innerHeight: number;
</script>

<svelte:head>
  <title>Game</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />

<div
  class="absolute z-10 h-4 w-4"
  style:display={x + 64 >= innerWidth || y + 64 >= innerHeight ? "none" : ""}
  style={$currentColor || $currentEmoji
    ? `translate: ${x + 16}px ${y}px; background: ${$currentColor}`
    : ""}
>
  {$currentEmoji}
</div>

<main class="noselect box-border flex flex-col items-center justify-start">
  <div
    class="playground flex w-full flex-row items-start justify-center"
    on:mousemove={setCursorEmoji}
  >
    <div
      class="box-border flex h-[100vh] w-5/6 flex-col items-center justify-center overflow-y-hidden duration-200 ease-out"
    >
      <span
        class="flex cursor-pointer flex-row items-center justify-center gap-3 py-6"
      >
        {#each views as view, i}
          <span
            class="opacity-50 duration-200 hover:scale-150"
            on:click={() => changeView(i)}
            class:currentView={viewIndex == i}
          >
            {view.emoji}
          </span>
        {/each}
      </span>
      <p class="text-2xl">{views[viewIndex].title}</p>

      <svelte:component this={views[viewIndex].component} />
    </div>
    <aside
      class="h-[100vh] w-1/6 overflow-y-auto rounded-tl-lg rounded-bl-lg  bg-sky-400 p-2 shadow-2xl"
    >
      <input
        class="w-full rounded-lg pl-1"
        type="text"
        placeholder="Search"
        bind:value={filter}
      />
      <div id="emoji-container">
        <h4 class="pt-4 pb-4 text-lg">
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
            <h4 class="pt-16 pb-4 text-lg">{category}</h4>
          {/if}
          <div class="flex flex-wrap">
            {#each emojis[category] as { emoji, name }}
              {#if name.includes(filter)}
                <div
                  class="duration-75 ease-out hover:scale-150"
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
    </aside>
  </div>
</main>

<style>
  /* TAILWINDED */
  @keyframes idle {
    100% {
      transform: translateY(-20px);
    }
  }

  nav > span > span {
    transition: 200ms ease-out;
    opacity: 50%;
  }

  nav > span > span:hover,
  .currentView {
    opacity: 100%;
    transform: scale(150%);
  }

  #emoji-container * {
    font-size: 1.25rem;
  }

  .selected {
    border: 2px solid red;
  }
</style>
