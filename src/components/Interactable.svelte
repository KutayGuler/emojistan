<script lang="ts">
  import {
    DURATIONS,
    INTERACTABLE_H,
    MIN_DURATION,
    MIN_INDEX,
    DEFAULT_SIDE_LENGTH,
  } from "$src/constants";
  // interactables = {
  // "emoji": {interactable}
  // }

  // example TREE
  // emoji: 🌲
  // onInteract: addToPlayerInventory {🍁} x {5}
  // hp: 100
  // modifiers: any: 0 | {🪓}: {-1}

  // example DOOR
  // emoji: 🚪
  // onInteract: ""
  // hp: 1
  // modifiers: any: 0 | {🔑}: {-1}

  // example KEY
  // emoji: 🔑
  // onInteract: addToPlayerInventory {🔑} x {1}
  // hp: 1
  // modifiers: any: -1

  // example FOOD
  // emoji: 🍔
  // onInteract: addToPlayerHP {20}
  // hp: 1
  // modifiers: any: -1

  // example POISONOUS MUSHROOM
  // emoji: 🍄
  // onInteract: addToPlayerHP {-20}
  // hp: 1
  // modifiers: any: -1

  // example MONEY
  // emoji: 💵
  // onInteract: changePlayerTo {🤑}
  // hp: 1
  // modifiers: any: -1

  // example GROWING A PLANT
  // emoji: 🌱
  // hp: 1
  // modifiers: any: 0 | 💧: +1
  // evolveAt: hp 10 to {🌳}

  import { nodesStore } from "$src/lib/stores/store";
  import {
    Devolve,
    Evolve,
    Interactable,
    SequenceItem,
    type Mutations,
  } from "$src/types";
  import { onDestroy, onMount } from "svelte";
  import { notifications } from "../routes/notifications";
  import { map, palette, currentEmoji, interactables } from "../store";

  let defaultBackground = $map.dbg;

  const types: {
    [key in "Player" | "Map" | "Background" | "Level"]: Array<keyof Mutations>;
  } = {
    Player: [
      "addToPlayerHP",
      "addToPlayerInventory",
      "changePlayerTo",
      "teleportPlayerTo",
    ],
    Map: ["spawn", "destroy"],
    Background: ["setBackgroundOf", "removeBackgroundOf"],
    Level: ["resetLevel", "completeLevel"],
  };

  const typeIcons = {
    Player: "👾",
    Map: "🗺️",
    Background: "🖌️",
    Level: "🎬",
  };

  let indexes: Array<number> = [];
  let hps: Array<number> = [];
  let modifierPoints: Array<number> = [];

  for (let i = 0; i < 100; i++) {
    hps[i] = i + 1;
    modifierPoints[i] = i + 1;
  }

  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }

  for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
    indexes[i] = i;
  }

  // COMPONENT RELATED
  export let id: number;
  let emoji = "";
  let sequence: Array<SequenceItem> = [];
  let hp: number;
  let points: number;
  let modifiers: Array<[string, number]> = [];
  let evolve = new Evolve(false, "", 2);
  let devolve = new Devolve(false, "");

  // SEQUENCE RELATED
  let type = types.Player[0];
  let duration = 0;
  let index = 0;
  let background = "";

  console.log($interactables);

  onMount(() => {
    let obj = $interactables.get(id);
    console.log(obj);

    if (!obj) return;
    ({ emoji, sequence, hp, points, modifiers, evolve, devolve } = obj);
  });

  function updateStore() {
    interactables.update(
      id,
      new Interactable(emoji, sequence, hp, points, modifiers, evolve, devolve)
    );
    // TODO: AdjustHeight for modifiers
    nodesStore.adjustHeight(id, sequence.length, INTERACTABLE_H);
  }

  onDestroy(() => {
    if (emoji == "") {
      interactables.remove(id);
      nodesStore.remove(id);
      return;
    }

    modifiers = modifiers.filter((m) => m[0] != "");
    modifiers = modifiers.filter((m, i) => {
      if (i == 0) return true;
      return m[1] != 0;
    });

    updateStore();
  });

  function updateModifierKey(index: number) {
    if (index == 0) return;
    modifiers[index] = [$currentEmoji, points];
  }

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", 1, MIN_DURATION, ""),
    ];
    updateStore();

    [type, duration, index, background] = [types.Player[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    updateStore();
  }

  function removeFromModifiers(i: number) {
    modifiers.splice(i, 1);
    modifiers = modifiers;
    updateStore();
  }

  function updateEmoji() {
    if (
      $currentEmoji != "" &&
      [evolve.to, devolve.to].includes($currentEmoji)
    ) {
      notifications.warning(
        "An interactable cannot evolve or devolve to itself"
      );
      return;
    }

    for (let [_id, val] of $interactables.entries()) {
      if (_id == id) continue;

      if ($currentEmoji == val.emoji) {
        notifications.warning("Cannot have two interactables with same emoji");
        return;
      }
    }

    emoji = $currentEmoji;
    updateStore();
  }

  function updateEvolveEmoji() {
    if (emoji == $currentEmoji) {
      notifications.warning("An interactable cannot evolve to itself");
      return;
    }

    evolve.to = $currentEmoji;
    updateStore();
  }

  // this function deals with two-way binded variable
  function updateHP() {
    if (evolve.enabled && hp >= evolve.at) {
      notifications.warning(
        "Default HP cannot be bigger than or equal to evolve HP"
      );
      hp = evolve.at - 1;
    }

    updateStore();
  }

  // this function deals with two-way binded variable
  function updateEvolveHP() {
    if (evolve.at <= hp) {
      notifications.warning(
        "Evolve HP cannot be smaller than or equal to default HP"
      );
      evolve.at = hp + 1;
    }

    updateStore();
  }

  function updateDevolveEmoji() {
    if (emoji == $currentEmoji) {
      notifications.warning("An interactable cannot devolve to itself");
      return;
    }

    devolve.to = $currentEmoji;
    updateStore();
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
    updateStore();
  }

  function checkEvolve(e: any) {
    if (evolve.at < hp) {
      evolve.at = hp + 1;
    }
  }

  $: hasInteraction = modifiers
    .filter((m) => m[0] != "")
    .some((m) => m[1] != 0);
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  {#if devolve.enabled}
    <div
      class="flex {evolve.enabled
        ? 'scale-75'
        : ''} flex-col items-center justify-center"
    >
      <div class="slot-lg" on:click={updateDevolveEmoji}>
        {devolve.to}
      </div>
      <div class="absolute -bottom-2">
        <select
          disabled
          class="select select-bordered select-sm text-xl"
          title="HP"
        >
          <option value={0}>0</option>
        </select>
      </div>
    </div>
  {/if}
  <div class="flex flex-col items-center justify-center">
    <div class="slot-lg" on:click={updateEmoji}>
      {emoji}
    </div>
    <div class="absolute -bottom-2">
      <select
        class="select select-bordered select-sm text-xl"
        title="HP"
        bind:value={hp}
        on:change={updateHP}
      >
        {#each hps as _hp}
          <option value={_hp}>{_hp}</option>
        {/each}
      </select>
    </div>
  </div>
  {#if evolve.enabled}
    <div
      use:checkEvolve
      class="flex {devolve.enabled
        ? 'scale-75'
        : ''}  flex-col  items-center justify-center"
    >
      <div class="slot-lg" on:click={updateEvolveEmoji}>
        {evolve.to}
      </div>
      <div class="absolute -bottom-2">
        <select
          class="select select-bordered select-sm text-xl"
          title="HP"
          bind:value={evolve.at}
          on:change={updateEvolveHP}
        >
          {#each hps as _hp}
            <option value={_hp}>{_hp}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</div>
<main class="flex flex-col items-center justify-center gap-12 pt-16">
  <div class="form-control w-full">
    <label class="label cursor-pointer">
      <span class="label-text">Evolve</span>
      <input type="checkbox" class="checkbox" bind:checked={evolve.enabled} />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">Devolve</span>
      <input type="checkbox" class="checkbox" bind:checked={devolve.enabled} />
    </label>
  </div>
  <div class="form-control flex flex-col">
    <p class="pb-6 text-4xl">
      HP MODIFIERS
      <button
        class="btn text-4xl"
        on:click={() => {
          modifiers = [...modifiers, ["", 1]];
        }}>+</button
      >
      {#if !hasInteraction}
        <div
          class="tooltip"
          data-tip="An interactable needs at least one modifier with positive or negative value to fire events"
        >
          <button class="btn text-4xl text-warning">!</button>
        </div>{/if}
    </p>

    <div
      class="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pb-6"
    >
      {#each modifiers as [key, value], i}
        <div class="relative flex flex-col items-center">
          {#if i != 0}
            <button
              class="absolute top-0 right-0 text-lg"
              on:click={() => removeFromModifiers(i)}>🞫</button
            >
          {/if}
          <div class="slot-lg scale-75" on:click={() => updateModifierKey(i)}>
            {key}
          </div>
          <select
            class="select select-bordered select-sm absolute -bottom-2"
            bind:value
            on:change={updateStore}
          >
            {#each modifierPoints as point}
              <option value={point}>{point > 0 ? `+${point}` : point}</option>
            {/each}
          </select>
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2">
    {#each sequence as s, i}
      <span class="flex w-full flex-row items-start justify-between gap-2">
        <select class="select" title="event type" bind:value={s.type}>
          {#each Object.entries(types) as [group, values]}
            <optgroup label={`${group} ${typeIcons[group]}`}>
              {#each values as t}
                <option value={t}>{t}</option>
              {/each}
            </optgroup>
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
        {:else if s.type == "addToPlayerInventory" || s.type == "changePlayerTo"}
          <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
        {:else if s.type == "addToPlayerHP"}
          <select class="select" bind:value={s.points} on:change={updateStore}>
            {#each modifierPoints.filter((val) => val != 0) as point}
              <option value={point}>{point > 0 ? `+${point}` : point}</option>
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
            <div
              class="tooltip"
              data-tip="Please create a palette to use this event"
            >
              <select class="select" title="color" />
            </div>
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
        <button
          class="text-2xl"
          id="remove"
          on:click={() => removeFromSequence(i)}>🞫</button
        >
      </span>
    {/each}
    <label>
      <select class="select" title="event type" bind:value={type}>
        {#each Object.entries(types) as [group, values]}
          <optgroup label={`${group} ${typeIcons[group]}`}>
            {#each values as t}
              <option value={t}>{t}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
      <button class="text-3xl" on:click={addToSequence}>+</button>
    </label>
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
