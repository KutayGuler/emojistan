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

  for (let i = 0; i < SIZE * SIZE; i++) {
    indexes[i] = i;
  }

  // COMPONENT RELATED
  export let id: number;
  let emoji = "";
  let sequence: Array<SequenceItem> = [];
  let hp = 1;
  let points = 0;
  let modifiers: Array<[string, number]> = [];
  let evolve = {
    to: "",
    at: 2,
  };
  let devolve = {
    to: "",
  };

  // SEQUENCE RELATED
  let type = types.Background[0];
  let duration = 0;
  let index = 0;
  let background = "";

  onMount(() => {
    let obj = $interactables.get(id);
    if (!obj) return;
    ({ emoji, sequence, hp, points, modifiers, evolve, devolve } = obj);
  });

  // ONLY REQUIRED FOR VISUALITY
  // TODO: determine values based on store data
  let evolveEnabled = evolve.to != "";
  let devolveEnabled = devolve.to != "";

  function updateStore() {
    interactables.update(
      id,
      new Interactable(emoji, sequence, hp, points, modifiers, evolve, devolve)
    );
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

    [type, duration, index, background] = [types.Background[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
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
    if (hp >= evolve.at) {
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

  // TODO: adjustHeight for modifiers

  $: console.log(modifiers);
  $: hasInteraction = modifiers
    .filter((m) => m[0] != "")
    .some((m) => m[1] != 0);
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  {#if devolveEnabled}
    <div
      class="flex {evolveEnabled
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
  <!-- TODO: Evolve hp and default hp can't be same -->
  {#if evolveEnabled}
    <div
      class="flex {devolveEnabled
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
<main class="pt-16">
  <div class="form-control">
    <label class="label cursor-pointer">
      <span class="label-text">Evolve</span>
      <input type="checkbox" class="checkbox" bind:checked={evolveEnabled} />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">Devolve</span>
      <input type="checkbox" class="checkbox" bind:checked={devolveEnabled} />
    </label>
  </div>
  <!-- <div>
    <input type="checkbox" bind:checked={evolveEnabled} />
  </div>
  <div>
    <input type="checkbox" bind:checked={devolveEnabled} />
  </div> -->
  {#each sequence as s, i}
    <span>
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
  <div class="form-control flex flex-col">
    <p>
      <b>hp modifiers</b>
      {#if !hasInteraction}
        <div
          class="tooltip"
          data-tip="An interactable needs at least one positive or negative modifier to fire events"
        >
          <button class="btn text-4xl text-warning">!</button>
        </div>{/if}
    </p>
    {#each modifiers as [key, value], i}
      <div class="flex flex-row items-center justify-start gap-2">
        <div class="slot" on:click={() => updateModifierKey(i)}>
          {key}
        </div>
        <select class="select" bind:value on:change={updateStore}>
          {#each modifierPoints as point}
            <option value={point}>{point > 0 ? `+${point}` : point}</option>
          {/each}
        </select>
        {#if i != 0}
          <button class="text-2xl" on:click={() => deleteModifier(i)}>🞫</button>
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
        {#each hps as h}
          <option value={h}>{h}</option>
        {/each}
      </select>
      <b>hp</b>
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
