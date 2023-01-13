<script lang="ts">
  import {
    DURATIONS,
    INTERACTABLE_H,
    MIN_DURATION,
    MIN_INDEX,
    SIZE,
  } from "$src/constants";
  // interactables = {
  // "emoji": {interactable}
  // }

  // example TREE
  // emoji: 🌲
  // onInteract: addToInventory {🍁} x {5}
  // health: 100
  // modifiers: anything: 0 | {🪓}: {-1}

  // example DOOR
  // emoji: 🚪
  // onInteract: ""
  // health: 1
  // modifiers: anything: 0 | {🔑}: {-1}

  // example KEY
  // emoji: 🔑
  // onInteract: addToInventory {🔑} x {1}
  // health: 1
  // modifiers: anything: -1

  // example FOOD
  // emoji: 🍔
  // onInteract: changePlayerHealth {20}
  // health: 1
  // modifiers: anything: -1

  // example POISONOUS MUSHROOM
  // emoji: 🍄
  // onInteract: changePlayerHealth {-20}
  // health: 1
  // modifiers: anything: -1

  // example MONEY
  // emoji: 💵
  // onInteract: changePlayerTo {🤑}
  // health: 1
  // modifiers: anything: -1

  // example GROWING A PLANT
  // emoji: 🌱
  // health: 1
  // modifiers: anything: 0 | 💧: +1
  // evolveAt: health 10 to {🌳}

  import { edgesStore, nodesStore } from "$src/lib/stores/store";
  import { onDestroy, onMount } from "svelte";
  import { notifications } from "../routes/notifications";
  import {
    currentEmoji,
    Interactable,
    interactables,
    palette,
    SequenceItem,
    map,
    type Mutations,
  } from "../store";

  let defaultBackground = $map.dbg;

  // emoji: the thing itself
  // onInteract: addToInventory {emoji} | changePlayerHealth {points} | changePlayerTo {emoji} | changeSelfTo {emoji}
  // health: 1
  // modifiers: anything: 0 | {emoji}: {points}

  const types: Array<keyof Mutations> = [
    "setBackgroundOf",
    "removeBackgroundOf",
    "spawn",
    "destroy",
    "wait",
    "addToInventory",
    "changePlayerHealthBy",
    "changePlayerTo",
    // "freezePlayer",
    // "unfreezePlayer",
    "teleportPlayerTo",
    "resetLevel",
    "completeLevel",
  ];

  let indexes: Array<number> = [];
  let healths: Array<number> = [];
  let modifierPoints: Array<number> = [];

  for (let i = 0; i < 100; i++) {
    healths[i] = i + 1;
    modifierPoints[i] = i + 1;
  }

  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }

  for (let i = 0; i < SIZE * SIZE; i++) {
    indexes[i] = i;
  }

  // COMPONENT RELATED
  export let id: number;
  let emoji = "";
  let sequence: Array<SequenceItem> = [];
  let health = 1;
  let points = 0;
  let modifiers: Array<[string, number]> = [];
  let evolve = {
    to: "",
    at: 1,
  };

  let enableEvolution;

  // SEQUENCE RELATED
  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";

  onMount(() => {
    let obj = $interactables.get(id);
    console.log(obj);
    if (!obj) return;
    ({ emoji, sequence, health, points, modifiers, evolve } = obj);
    console.log(evolve);
  });

  function updateStore() {
    interactables.update(
      id,
      new Interactable(emoji, sequence, health, points, modifiers, evolve)
    );
    nodesStore.adjustHeight(id, sequence.length, INTERACTABLE_H);
  }

  onDestroy(() => {
    if (emoji == "") {
      interactables.remove(id);
      nodesStore.remove(id);
      edgesStore.filter(id);
      return;
    }

    console.log(modifiers);

    modifiers = modifiers.filter((m) => m[0] != "");
    modifiers = modifiers.filter((m, i) => {
      if (i == 0) return true;
      return m[1] != 0;
    });
    console.log(modifiers);

    updateStore();
  });

  function updateModifierKey(index: number) {
    if (index == 0) return;
    modifiers[index] = [$currentEmoji, points];
  }

  function deleteModifier(index: number) {
    modifiers.splice(index, 1);
    modifiers = modifiers;
  }

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", 1, MIN_DURATION, ""),
    ];
    updateStore();

    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    updateStore();
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
    updateStore();
  }
</script>

<div class="slot absolute -top-6 z-10" on:click={() => (emoji = $currentEmoji)}>
  {emoji}
</div>
<div class="absolute top-4">
  <select
    class="select select-bordered select-sm text-xl"
    title="health"
    bind:value={health}
    on:change={updateStore}
  >
    {#each healths as h}
      <option value={h}>{h}</option>
    {/each}
  </select>
</div>
<main class="pt-16">
  {#each sequence as s, i}
    <span>
      <select
        class="select"
        title="event type"
        id="type"
        bind:value={s.type}
        on:change={updateStore}
      >
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if s.type == "spawn"}
        <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
        at
        <select
          class="select"
          title="index"
          id="index"
          bind:value={s.index}
          on:change={updateStore}
        >
          {#each indexes as j}
            <option value={j}>{j}</option>
          {/each}
        </select>
      {:else if s.type == "addToInventory" || s.type == "changePlayerTo"}
        <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
      {:else if s.type == "changePlayerHealthBy"}
        <select class="select" bind:value={s.points} on:change={updateStore}>
          {#each modifierPoints as point}
            <option value={point}>{point}</option>
          {/each}
        </select>
      {:else if s.type == "destroy" || s.type == "teleportPlayerTo" || s.type == "removeBackgroundOf"}
        <select
          class="select"
          title="index"
          id="index"
          bind:value={s.index}
          on:change={updateStore}
        >
          {#each indexes as j}
            <option value={j}>{j}</option>
          {/each}
        </select>
      {:else if s.type == "wait"}
        <select
          class="select"
          title="duration"
          id="duration"
          bind:value={s.duration}
          on:change={updateStore}
        >
          {#each DURATIONS as d}
            <option value={d}>{d}</option>
          {/each}
        </select>
      {:else if s.type == "setBackgroundOf"}
        <select
          class="select"
          title="index"
          id="index"
          bind:value={s.index}
          on:change={updateStore}
        >
          {#each indexes as j}
            <option value={j}>{j}</option>
          {/each}
        </select>
        {#if $palette.size == 0 || ($palette.size == 1 && $palette.has(defaultBackground))}
          <select class="select" title="color">
            <option value="">No colors</option>
          </select>
        {:else}
          to
          <select
            class="select"
            title="color"
            bind:value={s.background}
            style:background={s.background}
            on:change={updateStore}
          >
            {#each [...$palette].filter((color) => color != defaultBackground) as color}
              <option value={color} style:background={color} />
            {/each}
          </select>
        {/if}
      {/if}
      <button id="remove" on:click={() => removeFromSequence(i)}>❌</button>
    </span>
  {/each}
  <label>
    <select class="select" title="event type" bind:value={type}>
      {#each types as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <button on:click={addToSequence}>➕</button>
  </label>
  <div class="form-control flex flex-col">
    <b>health modifiers</b>
    {#each modifiers as [key, value], i}
      <div class="flex flex-row items-center justify-start gap-2">
        <div class="slot" on:click={() => updateModifierKey(i)}>
          {key}
        </div>
        <select class="select" bind:value on:change={updateStore}>
          {#each modifierPoints as point}
            <option value={point}>{point}</option>
          {/each}
        </select>
        {#if i != 0}
          <button class="btn" on:click={() => deleteModifier(i)}>🞪</button>
        {/if}
      </div>
    {/each}
    <button
      class="btn"
      on:click={() => {
        modifiers = [...modifiers, ["", 1]];
      }}>Add modifier</button
    >
    <!-- <b>evolution modifier</b>
    <div class="flex w-full flex-row items-center justify-center gap-2">
      <b>Evolve to</b>

      <b>at</b>
      <select class="select" bind:value={evolve.at} on:change={updateStore}>
        {#each healths as h}
          <option value={h}>{h}</option>
        {/each}
      </select>
      <b>Health</b>
    </div> -->
  </div>
</main>

<!-- <div
  class="slot absolute -bottom-20"
  on:click={() => {
    evolve.to = $currentEmoji;
    updateStore();
  }}
>
  {evolve.to}
</div> -->
<style>
  span {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>
