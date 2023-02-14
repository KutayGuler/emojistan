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
    pushers,
    mergers,
    palette,
    interactables,
    equippables,
    consumables,
    statics,
  } from "../../store";

  import { emojis } from "./emojis";
  import { DEFAULT_SIDE_LENGTH } from "$src/constants";
  import { notifications } from "../notifications";
  import { rbxStore } from "$lib/stores/store";

  import Svelvet from "$lib";
  import Palette from "./Palette.svelte";

  function getStatics() {
    let _statics = new Set<string>($statics);
    $interactables.forEach(({ emoji, isStatic }) => {
      isStatic && _statics.add(emoji);
    });
    for (let [id, { emoji }] of [...$equippables, ...$consumables]) {
      _statics.add(emoji);
    }

    return _statics;
  }

  onMount(() => {
    if ($saves.currentSaveID == "") {
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
      pushers,
      mergers,
      equippables,
      consumables,
      interactables,
      palette,
      rbxStore,
    ]) {
      store.useStorage($saves.currentSaveID);
    }
  });

  const flipParams = { duration: 300 };
  let currentCategory = "💩";
  let filter = "";

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
  let hintsEnabled = false;

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

  function toggleView() {
    view = view == "editor" ? "rules" : "editor";
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

{#if $saves.currentSaveID != ""}
  <div class="absolute left-4 bottom-4 flex flex-row items-center pt-8">
    <kbd class="kbd kbd-sm mr-2 2xl:kbd-md">Esc</kbd>
    <p class="2xl:text-md text-sm">untoggle emoji / color</p>
  </div>
  {#if test}
    <button on:click={toggleTest} class="absolute top-4 right-4 z-10 text-4xl"
      >🞫</button
    >
  {/if}
  <main
    class="relative box-border flex h-screen select-none flex-col items-center justify-center gap-8 overflow-hidden overflow-x-hidden"
  >
    {#if !test}
      <div
        transition:fly={{ y: -200 }}
        class="absolute top-24 flex w-full flex-row items-center justify-center gap-8 text-lg 2xl:top-8 2xl:text-2xl"
      >
        <div
          class="{view == 'editor'
            ? 'scale-150 opacity-100'
            : 'opacity-50'} cursor-pointer duration-200 ease-out hover:scale-150 hover:opacity-100"
          on:click={toggleView}
        >
          🗺️
        </div>
        <div
          class="{view == 'rules'
            ? 'scale-150 opacity-100'
            : 'opacity-50'} cursor-pointer duration-200 hover:scale-150 hover:opacity-100"
          on:click={toggleView}
        >
          📚
        </div>
      </div>
    {/if}
    <div class="relative box-border flex flex-row items-center justify-center">
      {#if !test}
        <aside transition:fly={{ x: -200 }} class="aside">
          {#if view == "editor"}
            <div class="flex flex-col">
              <button
                title="Enable/Disable Hints"
                class:hintsEnabled
                class="absolute top-0.5 left-1 opacity-50 hover:cursor-pointer"
                on:click={() => (hintsEnabled = !hintsEnabled)}
              >
                🧙
              </button>
              <button
                class="btn bg-primary text-xs text-primary-content hover:bg-primary-focus 2xl:btn-md"
                on:click={toggleTest}>TEST</button
              >
              <div class="form-control">
                <label class="label cursor-pointer">
                  <span class="label-text text-xs 2xl:text-base"
                    >Show Indexes</span
                  >
                  <input
                    type="checkbox"
                    class="checkbox checkbox-secondary checkbox-sm 2xl:checkbox-md"
                    bind:checked={showIndex}
                  />
                </label>
              </div>
              <div class="flex flex-col gap-2">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-xs 2xl:text-base"
                      >Copy Mode {#if hintsEnabled}<div
                          class="tooltip tooltip-right"
                          data-tip="Right click on any cell to copy the corresponding emoji or background."
                        >
                          <button>🧙</button>
                        </div>{/if}
                    </span>
                  </label>
                  <select
                    class="select select-bordered  2xl:text-base"
                    bind:value={copyMode}
                  >
                    {#each deleteModes as mode}
                      <option value={mode}>{mode}</option>
                    {/each}
                  </select>
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text text-xs 2xl:text-base"
                      >Delete Mode {#if hintsEnabled}<div
                          class="tooltip tooltip-right"
                          data-tip="Left click on any cell to delete the corresponding emoji or background."
                        >
                          <button>🧙</button>
                        </div>{/if}</span
                    >
                  </label>
                  <select
                    class="select select-bordered 2xl:text-base"
                    bind:value={deleteMode}
                  >
                    {#each deleteModes as mode}
                      <option value={mode}>{mode}</option>
                    {/each}
                  </select>
                </div>

                <div class="flex flex-row" />
                <button
                  class="btn bg-accent text-xs text-accent-content hover:bg-accent-focus 2xl:btn-md 2xl:text-base"
                  on:click={clearMap}
                  >CLEAR {deleteTexts[deleteMode]}
                </button>
                <div class="w-full">
                  <label for="filler" class="label">
                    <span class="label-text text-xs 2xl:text-base"
                      >Filler {#if hintsEnabled}<div
                          class="tooltip tooltip-right"
                          data-tip="Select an emoji from the emoji container and click on the button below to fill the entire map with that emoji"
                        >
                          <button>🧙</button>
                        </div>{/if}</span
                    >
                  </label>
                  <button
                    id="filler"
                    disabled={$currentEmoji == ""}
                    class="btn w-full text-xs 2xl:btn-md 2xl:text-base"
                    on:click={fillMap}>Fill With {$currentEmoji}</button
                  >
                </div>
                <label class="label">
                  <span class="label-text text-xs 2xl:text-base"
                    >Palette ({$palette.size} / 8) {#if hintsEnabled}<div
                        class="tooltip tooltip-right"
                        data-tip="Click on the box on the left to choose a color then click on [+] button to add that color to the palette"
                      >
                        <button>🧙</button>
                      </div>{/if}</span
                  >
                </label>
                <Palette />
              </div>
            </div>
          {:else}
            <div class="form-control">
              <label class="label">
                <span class="label-text text-xs 2xl:text-base">Objective</span>
              </label>
              <textarea
                class="textarea textarea-bordered h-24"
                placeholder="Describe the goal"
                bind:value={$map.objective}
              />
            </div>
            <!-- TODO: add removing indicator when hovered -->
            <label class="label pt-4">
              <span class="label-text text-xs 2xl:text-base"
                >Statics 🗿
              </span></label
            >
            <button
              disabled={$currentEmoji == ""}
              class="btn w-full 2xl:btn-md"
              on:click={() => statics.add($currentEmoji)}
            >
              {$currentEmoji} +
            </button>
            <div class="overflow-y-auto">
              <div
                class="mt-2 grid w-full grid-flow-row grid-cols-2 justify-center gap-2 overflow-y-auto "
              >
                {#each [...$statics] as item (item)}
                  <div
                    transition:scale|local={flipParams}
                    animate:flip={flipParams}
                  >
                    <button
                      class="remove btn h-full w-full 2xl:btn-md"
                      on:click={() => statics.remove(item)}>{item}</button
                    >
                  </div>
                {/each}
              </div>
            </div>
            <label class="label pt-4">
              <span class="label-text text-xs 2xl:text-base"
                >Dialogues 🗿
              </span></label
            >
          {/if}
        </aside>
      {/if}
      {#if test}
        <Game
          map={structuredClone($map)}
          pushers={$pushers}
          mergers={$mergers}
          interactables={$interactables}
          equippables={$equippables}
          consumables={$consumables}
          statics={getStatics()}
          on:noPlayer={() => {
            test = false;
            notifications.warning("No controllable player in the map");
          }}
          on:quit={() => {
            test = false;
          }}
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
        <aside transition:fly={{ x: 200 }} class="aside overflow-y-auto pt-0">
          <div
            class="sticky top-0 flex w-full flex-col items-center justify-center gap-4 bg-base-200 p-4 pt-8"
          >
            <input
              class="input input-bordered input-sm w-full 2xl:input-md"
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
              {/if}
            {/each}
          </div>
        </aside>
      {/if}
    </div>
  </main>
{/if}

<style>
  .hintsEnabled {
    opacity: 1;
  }

  .tooltip:before {
    z-index: 10;
  }
</style>
