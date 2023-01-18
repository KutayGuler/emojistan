<script lang="ts">
  // SVELTEKIT
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { goto } from "$app/navigation";
  import { fly, scale } from "svelte/transition";

  // VIEWS
  import Play from "../../views/Play.svelte";
  import Editor from "../../views/Editor.svelte";

  // STORES
  import {
    currentEmoji,
    currentColor,
    saves,
    map,
    pushes,
    merges,
    palette,
    statics,
    interactables,
  } from "../../store";

  import { emojis } from "./emojis";
  import { SIZE } from "$src/constants";
  import { notifications } from "../notifications";
  import { nodesStore } from "$lib/stores/store";

  import Svelvet from "$lib";
  import Palette from "$components/Palette.svelte";

  onMount(() => {
    if ($saves.current == "") {
      let saveExists = saves.useStorage();
      if (!saveExists) {
        goto("/", { replaceState: true });
        notifications.info("Failed to find save file.");
        return;
      }
    }
    // STORE NAMES
    // CF #7
    for (let store of [
      map,
      pushes,
      merges,
      interactables,
      palette,
      statics,
      nodesStore,
    ]) {
      store.useStorage($saves.current);
    }
  });

  const flipParams = { duration: 300 };
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

  type DeleteMode = "Item" | "Background" | "Both";
  const deleteModes: Array<DeleteMode> = ["Item", "Background", "Both"];
  const deleteTexts: { [key in DeleteMode]: string } = {
    Item: "ITEMS",
    Background: "BGS",
    Both: "ALL",
  };

  let deleteMode = deleteModes[2];

  function fillMap() {
    if ($currentEmoji == "") return;
    for (let i = 0; i < SIZE * SIZE; i++) {
      $map.items.set(i, $currentEmoji);
    }
    $map = $map;
  }

  function clearMap() {
    switch (deleteMode) {
      case "Item":
        map.clearItems();
        break;
      case "Background":
        map.clearBackgrounds();
        break;
      case "Both":
        map.clearAll();
        break;
    }
  }

  let test = false;
  let view: "editor" | "rules" = "rules";
</script>

<svelte:head>
  <title>Emojistan / Editor</title>
</svelte:head>

<svelte:window on:keydown={handleKeydown} bind:innerWidth bind:innerHeight />

{#if $saves.current != ""}
  <main
    class="noselect relative box-border flex h-screen flex-row items-center justify-center overflow-x-hidden text-2xl"
  >
    {#if view != "rules"}
      <button
        class="btn absolute top-6 z-10 h-20 w-40 bg-primary text-5xl"
        on:click={() => {
          test = !test;
          if (!test) {
            $currentEmoji = "";
          }
        }}>{test ? "EDIT" : "TEST"}</button
      >
    {/if}
    <div class="relative box-border flex flex-row items-center justify-center">
      {#if !test}
        <aside
          transition:fly={{ x: -200 }}
          style:background={$map.dbg}
          class="aside"
        >
          <div
            class="sticky top-0 flex w-full flex-row items-center justify-center gap-8 bg-base-300 p-4 py-8"
          >
            <div
              class="{view == 'editor'
                ? 'scale-150 opacity-100'
                : 'opacity-50'} cursor-pointer duration-200 ease-out hover:scale-150 hover:opacity-100"
              on:click={() => (view = "editor")}
            >
              🗺️
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
                <label class="label cursor-pointer">
                  <span class="label-text">Show Indexes</span>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-secondary"
                    bind:checked={showIndex}
                  />
                </label>
              </div>
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
              <div class="flex flex-col gap-2">
                <div class="form-control w-full max-w-xs">
                  <label for="deleteMode" class="label">
                    <span class="label-text">Delete Mode</span>
                  </label>
                  <select
                    class="select select-bordered"
                    bind:value={deleteMode}
                  >
                    {#each deleteModes as mode}
                      <option value={mode}>{mode}</option>
                    {/each}
                  </select>
                </div>
                <div class="flex flex-row" />
                <button class="btn bg-accent" on:click={clearMap}
                  >CLEAR {deleteTexts[deleteMode]}
                </button>
                <button
                  disabled={$currentEmoji == ""}
                  class="btn"
                  on:click={fillMap}>Fill With {$currentEmoji}</button
                >
              </div>
            </div>
            <Palette />
            <h4 class="pt-8">Statics 🗿</h4>
            <button
              disabled={$currentEmoji == ""}
              class="add btn w-full text-2xl"
              on:click={() => statics.add($currentEmoji)}
            >
              [ {$currentEmoji == "" ? "___" : $currentEmoji} ]
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
      {/if}
      {#if test}
        <Play />
      {:else if view == "editor"}
        <div class="flex flex-col justify-center px-8">
          <Editor {showIndex} {deleteMode} />
        </div>
      {:else if view == "rules"}
        <div class="flex flex-col justify-center px-8">
          <Svelvet />
        </div>
      {/if}
      {#if !test}
        <aside
          transition:fly={{ x: 200 }}
          style:background={$map.dbg}
          class="aside"
        >
          <div
            class="sticky top-0 flex w-full flex-col items-center justify-center gap-4 bg-base-300 p-4 pt-8"
          >
            <div
              style:background={$currentColor || $map.dbg}
              class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-base-300 text-3xl"
              on:click={() => ($currentEmoji = "")}
            >
              {#key $currentEmoji}
                <span in:scale>{$currentEmoji}</span>
              {/key}
            </div>
            <input
              class="input input-bordered w-full"
              type="text"
              placeholder="Search"
              bind:value={filter}
            />
            <div class="my-4 grid grid-cols-4 grid-rows-2 gap-4">
              {#each Object.keys(emojis) as category}
                <div
                  class="{category == currentCategory
                    ? 'scale-125 opacity-100'
                    : 'hover:scale-125 hover:opacity-100'} cursor-pointer opacity-50 duration-75 ease-out"
                  on:click={() => (currentCategory = category)}
                >
                  {category}
                </div>
              {/each}
            </div>
          </div>
          <div id="flex flex-col">
            {#each Object.keys(emojis) as category}
              {#if currentCategory == category}
                <div class="emojis flex flex-wrap justify-center">
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
      {/if}
    </div>
  </main>
{/if}

<style>
  .emojis > div {
    font-size: 1.25rem;
    width: 12%;
    transition: 75ms ease-out;
  }

  .emojis > div:hover {
    transform: scale(1.5, 1.5);
  }
</style>
