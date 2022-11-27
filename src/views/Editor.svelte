<script lang="ts">
  import { currentEmoji, currentColor, map, palette } from "../store";
  import Play from "./Play.svelte";

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
      // db.saves.update();
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
</script>

<svelte:window
  on:keydown={(e) => {
    console.log(e);
    e.preventDefault();
    if (e.code == "Tab") {
      test = !test;
    }
  }}
/>

{#if test}
  <Play />
{:else}
  <!-- TODO: Add palette to left side -->
  <div class="map">
    {#each { length: 256 } as _, i}
      <div
        class="cell"
        style:background={$map.backgrounds.get(i) ||
          "var(--default-background)"}
        on:click={() => clickedCell(i)}
      >
        {$map?.items.get(i) || (showIndex ? i : "")}
      </div>
    {/each}
  </div>
{/if}
<div class="flex flex-col">
  <div class="form-control">
    <!-- TODO: Change objective to modal -->
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
