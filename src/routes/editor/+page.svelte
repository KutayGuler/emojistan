<script lang="ts">
  // SVELTEKIT
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { flip } from "svelte/animate";
  import { fly, scale } from "svelte/transition";

  // VIEWS
  import Game from "../../views/Game.svelte";
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
    interactables,
    equippables,
    consumables,
  } from "../../store";

  import { emojis } from "./emojis";
  import { DEFAULT_SIDE_LENGTH } from "$src/constants";
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
      equippables,
      consumables,
      interactables,
      palette,
      nodesStore,
    ]) {
      store.useStorage($saves.current);
    }
  });

  const flipParams = { duration: 300 };
  let currentCategory = "💩";
  let filter = "";
  let statics = new Set<string>();
  $interactables.forEach(({ emoji, isStatic }) => {
    isStatic && statics.add(emoji);
  });
  $equippables.forEach((emoji) => statics.add(emoji));

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Escape") {
      $currentEmoji = "";
      $currentColor = "";

      if (test) {
        test = false;
      }
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
  let copyMode = deleteModes[2];

  function fillMap() {
    if ($currentEmoji == "") return;
    for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
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
  let view: "editor" | "rules" = "editor";

  function toggleTest() {
    test = !test;
    if (!test) {
      $currentEmoji = "";
    }
  }

  let [x, y] = [0, 0];
</script>

<svelte:head>
  <title>Emojistan | Editor</title>
</svelte:head>

<svelte:window
  on:mousemove={(e) => {
    x = e.clientX;
    y = e.clientY;
  }}
  on:keydown={handleKeydown}
  bind:innerWidth
  bind:innerHeight
/>
<div
  style:background={$currentColor || "none"}
  class="absolute z-50 flex h-6 w-6 items-center justify-center rounded bg-red-500"
  style="transform: translate({x + 12}px, {y - 12}px);"
>
  {$currentEmoji}
</div>

{#if $saves.current != ""}
  {#if test}
    <button on:click={toggleTest} class="absolute top-4 right-4 z-10 text-4xl"
      >🞫</button
    >
  {/if}
  <main
    class="noselect relative box-border flex h-screen flex-col items-center justify-center gap-8 overflow-hidden overflow-x-hidden"
  >
    {#if !test}
      <div
        transition:fly={{ y: -200 }}
        class="absolute top-12 flex w-full flex-row items-center justify-center gap-8 text-2xl"
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
    {/if}
    <div class="relative box-border flex flex-row items-center justify-center">
      {#if !test}
        <aside transition:fly={{ x: -200 }} class="aside">
          {#if view == "editor"}
            <div class="flex flex-col">
              <button
                class="btn bg-primary text-primary-content hover:bg-primary-focus"
                on:click={toggleTest}>TEST</button
              >
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
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Copy Mode</span>
                  </label>
                  <select class="select select-bordered" bind:value={copyMode}>
                    {#each deleteModes as mode}
                      <option value={mode}>{mode}</option>
                    {/each}
                  </select>
                </div>
                <div class="form-control">
                  <label class="label">
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
                <button
                  class="btn bg-accent text-accent-content hover:bg-accent-focus"
                  on:click={clearMap}
                  >CLEAR {deleteTexts[deleteMode]}
                </button>

                <p class="label-text">Filler</p>
                <button
                  disabled={$currentEmoji == ""}
                  class="btn"
                  on:click={fillMap}>Fill With {$currentEmoji}</button
                >
              </div>
            </div>
            <Palette />
          {:else}
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
            <p class="label-text pt-4">Equippables 🪕</p>
            <button
              disabled={$currentEmoji == ""}
              class="btn w-full "
              on:click={() => {
                for (let val of [
                  ...$consumables.values(),
                  ...$interactables.values(),
                ]) {
                  if ($currentEmoji == val.emoji) {
                    notifications.warning(
                      "An emoji can only have one assigned type. Interactable, Consumable or Equippable"
                    );
                    return;
                  }
                }

                equippables.add($currentEmoji);
              }}
            >
              {$currentEmoji} +
            </button>
            <div class="overflow-y-auto">
              <div
                class="mt-2 grid w-full grid-flow-row grid-cols-2 justify-center gap-2 overflow-y-auto "
              >
                {#each [...$equippables] as item (item)}
                  <div
                    transition:scale|local={flipParams}
                    animate:flip={flipParams}
                  >
                    <button
                      class="remove btn h-full w-full"
                      on:click={() => equippables.remove(item)}>{item}</button
                    >
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </aside>
      {/if}
      {#if test}
        <Game
          map={structuredClone($map)}
          pushes={$pushes}
          merges={$merges}
          interactables={$interactables}
          equippables={$equippables}
          consumables={$consumables}
          {statics}
        />
      {:else if view == "editor"}
        <div class="flex flex-col justify-center px-8">
          <Editor {showIndex} {deleteMode} {copyMode} />
        </div>
      {:else if view == "rules"}
        <div class="flex flex-col justify-center px-8">
          <Svelvet />
        </div>
      {/if}
      {#if !test}
        <aside transition:fly={{ x: 200 }} class="aside">
          <div
            class="sticky -top-8 flex w-full flex-col items-center justify-center gap-4 bg-base-200 bg-transparent p-4"
          >
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
                    ? 'scale-125'
                    : 'opacity-50 hover:scale-125 hover:opacity-100'} cursor-pointer duration-75 ease-out"
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
