<script lang="ts">
  // DEMO FEATURES
  // TODO: individual style transforms for emojis // rotation, scale, opacity
  // TODO: inventory (events => addItem, consumeItem)
  // TODO: Event trigger even if player does not move

  // VIEWS
  import Editor from "../../views/Editor.svelte";

  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";

  const flipParams = { duration: 300 };

  // DATA
  import {
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
  import { emojis } from "./emojis";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Palette from "$components/Palette.svelte";
  import Svelvet from "$lib";
  import Play from "../../views/Play.svelte";
  import { edgesStore, nodesStore } from "$lib/stores/store";
  import { SIZE } from "$src/constants";

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

  let currentCategory = "💩";
  let filter = "";

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Escape") {
      $currentEmoji = "";
      $currentColor = "";
    }
  }

  function pickEmoji(emoji: string) {
    $currentEmoji = emoji == $currentEmoji ? "" : emoji;
  }

  let innerWidth: number;
  let innerHeight: number;

  let showIndex = false;

  const clearModes = ["Items", "Backgrounds", "All"];

  let clearMode = clearModes[2];

  function fillMap() {
    if ($currentEmoji == "") return;
    for (let i = 0; i < SIZE * SIZE; i++) {
      $map.items.set(i, $currentEmoji);
    }
    $map = $map;
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
    class="noselect relative box-border flex h-screen flex-row items-center justify-center overflow-x-hidden text-2xl"
  >
    <button
      class="btn absolute top-6 z-10 h-20 w-40 bg-primary text-5xl"
      on:click={() => {
        test = !test;
        if (!test) {
          $currentEmoji = "";
        }
      }}>{test ? "EDIT" : "TEST"}</button
    >
    <div
      class="relative box-border flex h-3/4 w-full flex-row items-center justify-center overflow-y-auto"
    >
      <aside style:background={$map.dbg} class="aside">
        <div class="flex flex-row items-center justify-center gap-8 py-4">
          <div
            class="{view == 'editor'
              ? 'scale-150 opacity-100'
              : 'opacity-50'} cursor-pointer duration-200 ease-out hover:scale-150 hover:opacity-100"
            on:click={() => (view = "editor")}
          >
            🏗️
          </div>
          <div
            class="{view == 'rules'
              ? 'scale-150 opacity-100'
              : 'opacity-50'} cursor-pointer duration-200 hover:scale-150 hover:opacity-100"
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
            class="add btn w-full text-2xl"
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
      <div class="px-8">
        {#if view != "rules"}{/if}
        {#if test}
          <Play />
        {:else if view == "editor"}
          <Editor {showIndex} />
        {:else if view == "rules"}
          <Svelvet />
        {/if}
      </div>
      <aside style:background={$map.dbg} class="aside">
        <input
          class="input input-bordered w-full"
          type="text"
          placeholder="Search"
          bind:value={filter}
        />
        <div class="my-4 grid grid-cols-4 grid-rows-2 gap-4 p-4">
          {#each Object.keys(emojis) as category}
            <div
              class="{category == currentCategory
                ? 'scale-150 opacity-100'
                : 'hover:scale-150 hover:opacity-100'} cursor-pointer opacity-50 duration-75 ease-out"
              on:click={() => (currentCategory = category)}
            >
              {category}
            </div>
          {/each}
        </div>
        <div id="flex flex-col">
          {#each Object.keys(emojis) as category}
            {#if currentCategory == category}
              <div class="emojis flex flex-wrap">
                {#each emojis[category] as [emoji, name]}
                  {#if name.includes(filter)}
                    <div on:click={() => pickEmoji(emoji)} title={name}>
                      {emoji}
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          {/each}
        </div>
      </aside>
    </div>
    <!-- <div
      style:background={$currentColor || $map.dbg}
      class="{test
        ? '-right-24'
        : 'right-64'} absolute top-0 m-4 flex h-8 w-8 items-center justify-center bg-base-300 md:h-10 md:w-10 lg:h-12 lg:w-12"
      on:click={() => ($currentEmoji = "")}
    >
      {#key $currentEmoji}
        <span in:scale>{$currentEmoji}</span>
      {/key}
    </div> -->
  </main>
{/if}

<style>
  .emojis > div {
    font-size: 1.25rem;
    transition: 75ms ease-out;
  }

  .emojis > div:hover {
    transform: scale(1.5, 1.5);
  }

  aside {
    transition: 200ms ease-out;
  }
</style>
