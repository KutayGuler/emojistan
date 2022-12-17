<script lang="ts">
  // VIEWS
  import Editor from "../../views/Editor.svelte";

  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import type { Node, Edge } from "$lib/types/types";

  const flipParams = { duration: 300 };

  // DATA
  import {
    quickAccess,
    currentEmoji,
    currentColor,
    conditions,
    saves,
    map,
    pushes,
    merges,
    events,
    loopEvents,
    palette,
    statics,
  } from "../../store";
  import { notifications } from "../notifications";
  import { emojis } from "../../emojis";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Palette from "$components/Palette.svelte";
  import Svelvet from "$lib";
  import Play from "../../views/Play.svelte";
  import { svelvetStore } from "$lib/stores/store";

  const { edgesStore, nodesStore } = svelvetStore;

  onMount(() => {
    if ($saves.current == "") {
      let saveExists = saves.useStorage();
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
      conditions,
      events,
      loopEvents,
      palette,
      statics,
      nodesStore,
      edgesStore,
    ]) {
      store.useStorage($saves.current);
    }
  });

  let filter = "";

  // quickAcess edit mode
  let editMode = false;

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Escape") {
      $currentEmoji = "";
      $currentColor = "";
    }
  }

  function pickEmoji(emoji: string) {
    $currentEmoji = emoji == $currentEmoji ? "" : emoji;
    console.log($currentEmoji);
  }

  let innerWidth: number;
  let innerHeight: number;

  let showIndex = false;

  const deleteModes = ["Item", "Background", "Both"];
  const clearModes = ["Items", "Backgrounds", "All"];

  let deleteMode = deleteModes[2];
  let clearMode = clearModes[2];

  function fillMap() {
    if ($currentEmoji == "") return;
    for (let i = 0; i < 256; i++) {
      $map.items.set(i, $currentEmoji);
    }
    $map = $map;
    console.log($map);
  }

  function clearMap() {
    switch (clearMode) {
      case "Items":
        map.clearObjects();
        break;
      case "Backgrounds":
        map.clearBackgrounds();
        break;
      case "All":
        map.clearAll();
        break;
    }
  }

  let test = false;
  let view: "editor" | "rules" = "editor";
</script>

<svelte:head>
  <title>Emojistan / Editor</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />

{#if $saves.current != ""}
  <main
    class="noselect relative box-border flex flex-row items-end justify-end overflow-x-hidden text-2xl"
  >
    <aside
      class="absolute {test
        ? '-left-64'
        : '-left-0'} z-10 h-[100vh] w-64  overflow-y-auto bg-base-200 p-2"
    >
      <div class="flex flex-row items-center justify-center gap-8 py-4">
        <div
          class="{view == 'editor'
            ? 'scale-150 opacity-100'
            : 'opacity-50'} duration-200 ease-out hover:scale-150 hover:opacity-100"
          on:click={() => (view = "editor")}
        >
          🏗️
        </div>
        <div
          class="{view == 'rules'
            ? 'scale-150 opacity-100'
            : 'opacity-50'} duration-200 hover:scale-150 hover:opacity-100"
          on:click={() => (view = "rules")}
        >
          📜
        </div>
      </div>
      {#if view == "editor"}
        <div class="flex flex-col pb-8">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Objective</span>
            </label>
            <textarea
              class="textarea textarea-bordered h-24"
              placeholder="Describe the goal"
              bind:value={$map.objective}
            />
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Show Indexes</span>
              <input
                type="checkbox"
                class="checkbox checkbox-secondary"
                bind:checked={showIndex}
              />
            </label>
          </div>
          <div class="flex flex-col gap-2">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">Delete Mode</span>
              </label>
              <select class="select select-bordered" bind:value={deleteMode}>
                {#each deleteModes as mode}
                  <option value={mode}>{mode}</option>
                {/each}
              </select>
            </div>
            <div class="form-control w-full max-w-xs">
              <label for="clearMode" class="label">
                <span class="label-text">Clear Mode</span>
              </label>
              <select class="select select-bordered" bind:value={clearMode}>
                {#each clearModes as mode}
                  <option value={mode}>{mode}</option>
                {/each}
              </select>
            </div>
            <button class="btn bg-accent" on:click={clearMap}>CLEAR</button>
            <button class="btn" on:click={fillMap}
              >Fill With [{$currentEmoji || "____"}]</button
            >
          </div>
        </div>
        <Palette />
        <h4 class="pt-8">Statics 🗿</h4>
        <button
          class="add btn h-24 w-full text-2xl"
          on:click={() => statics.add($currentEmoji)}
        >
          [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
        </button>
        <div class="h-1/3 overflow-y-auto">
          <div
            class="mt-2 grid w-full grid-flow-row grid-cols-2 justify-center gap-2 overflow-y-auto "
          >
            {#each [...$statics] as item (item)}
              <div
                transition:scale|local={flipParams}
                animate:flip={flipParams}
              >
                <button
                  class="remove btn h-full w-full text-2xl"
                  on:click={() => statics.remove(item)}>{item}</button
                >
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </aside>

    <div
      class="relative box-border flex h-[100vh] w-full flex-col items-center justify-center overflow-y-auto"
    >
      <div class="flex w-full flex-col items-center justify-start gap-4">
        {#if view != "rules"}
          <button
            class="btn z-10 w-32 bg-primary"
            on:click={() => {
              test = !test;
              if (!test) {
                $currentEmoji = "";
              }
            }}>{test ? "EDIT" : "TEST"}</button
          >
        {/if}
        {#if test}
          <Play />
        {:else if view == "editor"}
          <Editor {showIndex} />
        {:else if view == "rules"}
          <Svelvet />
        {/if}
      </div>
    </div>
    <!-- w-1/5 -->
    <div
      style:background={$currentColor || $map.dbg}
      class="absolute {test
        ? '-right-20'
        : 'right-64'} top-0 flex h-20 w-20 flex-col items-center justify-center self-end p-10 text-4xl duration-200 ease-in-out"
      on:click={() => ($currentEmoji = "")}
    >
      {$currentEmoji}
    </div>
    <aside
      style:background={$map.dbg}
      class="absolute {test
        ? '-right-64'
        : '-right-0'} h-[100vh] w-64 overflow-y-auto p-2"
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
          {#if emojis[category].some((item) => item[0].includes(filter))}
            <h4 class="pt-16 pb-4 text-lg">{category}</h4>
          {/if}
          <div class="emojis flex flex-wrap">
            {#each emojis[category] as [emoji, name]}
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
    </aside>
  </main>
{/if}

<style>
  /* TAILWINDED */
  #emoji-container * {
    font-size: 1.25rem;
  }

  .emojis > div {
    transition: 75ms ease-out;
  }

  .emojis > div:hover {
    scale: 1.5;
  }

  .selected {
    border: 2px solid red;
  }

  aside {
    transition: 200ms ease-out;
  }
</style>
