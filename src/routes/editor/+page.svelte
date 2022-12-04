<script lang="ts">
  // VIEWS
  import Editor from "../../views/Editor.svelte";

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
    defaultBackground,
  } from "../../store";
  import { notifications } from "../notifications";
  import { emojis } from "../../emojis";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Palette from "$components/Palette.svelte";
  import Svelvet from "$lib";
  import Play from "../../views/Play.svelte";
  import Spawner from "$lib/Containers/GraphView/Spawner.svelte";

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

  let [x, y] = [0, 0];

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Tab") {
      e.preventDefault();
      test = !test;
      return;
    }

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

  function pickColor(color: string) {
    console.log(color);
    $currentColor = color == $currentColor ? "" : color;
  }

  function clickedCell(index: number) {
    if ($currentColor == "" && $currentEmoji == "") {
      switch (deleteMode) {
        case "Item":
          map.removeEmoji(index);
          break;
        case "Background":
          map.deleteBackground(index);
          break;
        default:
        case "Both":
          map.removeEmoji(index);
          map.deleteBackground(index);
          break;
      }
      return;
    }

    if ($currentColor != "") {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji != "") {
      map.addEmoji(index, $currentEmoji);
    }
  }

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
  <main class="noselect box-border flex flex-row items-end justify-end">
    <aside
      class="right-0 h-[100vh] w-1/5 overflow-y-auto rounded-tr-lg rounded-bl-lg  bg-base-200 p-2 text-lg shadow-2xl"
    >
      {#if view == "editor"}
        <button class="btn w-full">SAVE MAP</button>
        <p>Last saved:</p>
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
              <label class="label">
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
            <button
              class="btn bg-primary"
              on:click={() => {
                test = !test;
                if (!test) {
                  $currentEmoji = "";
                }
              }}>{test ? "EDIT" : "TEST"}</button
            >
          </div>
        </div>
        <Palette />
        <h4 class="pt-8">Statics 🗿</h4>
        <button
          class="add btn w-full"
          on:click={() => statics.add($currentEmoji)}
        >
          [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
        </button>
        <div class="flex h-1/3 w-full flex-col justify-start overflow-y-auto">
          {#each [...$statics] as item (item)}
            <div transition:scale|local={flipParams} animate:flip={flipParams}>
              <button
                class="remove btn w-full"
                on:click={() => statics.remove(item)}>{item}</button
              >
            </div>
          {/each}
        </div>
        <!-- TODO: Dropdown -->
        <h4>Settings</h4>
        <!-- Island name -->
        <input
          type="text"
          placeholder="Type here"
          class="input w-full max-w-xs"
        />
        <button class="btn">DELETE ISLAND</button>
      {:else if view == "rules"}
        <Spawner />
      {/if}
    </aside>
    <div
      class="relative box-border flex h-[100vh] w-full flex-col items-center justify-center overflow-y-auto"
    >
      <button
        class="btn absolute top-0 left-0"
        on:click={() => {
          if (view == "editor") {
            view = "rules";
          } else {
            view = "editor";
          }
        }}>CHANGE VIEW</button
      >
      <p
        class="absolute top-0 flex h-20 w-20 flex-col items-center justify-center self-end p-10 text-4xl"
        style:background={$currentColor || $defaultBackground}
      >
        {$currentEmoji}
      </p>
      <div class="flex w-full flex-col items-center justify-start gap-4">
        {#if test}
          <Play />
        {:else if view == "editor"}
          <!-- content here -->
          <Editor />
        {:else}
          <!-- else content here -->
          <Svelvet nodes={initialNodes} edges={initialEdges} background />
        {/if}
      </div>
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
          {#if emojis[category].some((item) => item[0].includes(filter))}
            <h4 class="pt-16 pb-4 text-lg">{category}</h4>
          {/if}
          <div class="flex flex-wrap">
            {#each emojis[category] as [emoji, name]}
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
