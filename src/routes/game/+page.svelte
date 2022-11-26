<script lang="ts">
  // VIEWS
  import Editor from "../../views/Editor.svelte";
  import Rules from "../../views/Rules.svelte";

  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import type { Node, Edge } from "$lib/types/types";

  // TODO: Fill them up with localStorage saves
  const initialNodes: Array<Node> = [];
  const initialEdges: Array<Edge> = [];

  const flipParams = { duration: 300 };

  // DATA
  import {
    quickAccess,
    currentEmoji,
    currentColor,
    saves,
    map,
    pushes,
    merges,
    events,
    loopEvents,
    palette,
    statics,
    modal,
  } from "../../store";
  import { notifications } from "../notifications";
  import { emojis } from "../../emojis";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Palette from "$components/Palette.svelte";

  onMount(() => {
    if ($saves.current == "") {
      let saveExists = saves.useStorage();
      console.log(saveExists);
      if (!saveExists) {
        goto("/", { replaceState: true });
        notifications.info("Failed to find save file.");
        return;
      }
    }
    for (let store of [
      map,
      pushes,
      merges,
      events,
      loopEvents,
      palette,
      statics,
    ]) {
      store.useStorage($saves.current);
    }
  });

  let filter = "";

  // quickAcess edit mode
  let editMode = false;

  let viewIndex = 1;

  let views = [
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
  <title>Emojistan / Game</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />

{#if $saves.current != ""}
  <!-- TODO: Fix this -->
  <div
    class="absolute z-10 h-4 w-4"
    style:display={x + 64 >= innerWidth || y + 64 >= innerHeight ? "none" : ""}
    style:background={$currentColor}
    style:border={$currentColor != ""
      ? "1px solid var(--default-background);"
      : ""}
    style={$currentEmoji || $currentColor
      ? `translate: ${x + 16}px ${y}px;`
      : ""}
  >
    {$currentEmoji}
  </div>

  <main
    class="noselect box-border flex flex-row items-end justify-end"
    on:mousemove={setCursorEmoji}
  >
    <aside
      class="right-0 h-[100vh] w-1/5 overflow-y-auto rounded-tl-lg rounded-bl-lg  bg-sky-400 p-2 shadow-2xl"
    >
      <Palette />
      <div class="flex h-1/2 w-1/6 flex-col justify-start">
        <div class="w-3/4">
          <h4 class="info" on:click={() => modal.show("statics")}>
            Statics 🗿
          </h4>
          <button class="add btn" on:click={() => statics.add($currentEmoji)}>
            [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
          </button>
          {#each [...$statics] as item (item)}
            <div transition:scale|local={flipParams} animate:flip={flipParams}>
              <button class="remove btn" on:click={() => statics.remove(item)}
                >{item}</button
              >
            </div>
          {/each}
        </div>
      </div>
    </aside>
    <div
      class="box-border flex h-[100vh] w-full flex-col items-center justify-start overflow-y-auto"
    >
      {#each [Editor, Rules] as component}
        <div
          class="flex w-full flex-row items-center justify-center gap-4 pt-16"
        >
          <svelte:component this={component} />
        </div>
      {/each}
    </div>
    <aside
      class="right-0 h-[100vh] w-1/5 overflow-y-auto rounded-tl-lg rounded-bl-lg  bg-sky-400 p-2 shadow-2xl"
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
  </main>
{/if}

<style>
  /* TAILWINDED */
  #emoji-container * {
    font-size: 1.25rem;
  }

  .selected {
    border: 2px solid red;
  }
</style>
