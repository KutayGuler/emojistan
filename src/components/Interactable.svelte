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
  // onInteract: dropEquippable {🍁} x {5}
  // hp: 100
  // modifiers: any: 0 | {🪓}: {-1}

  // example DOOR
  // emoji: 🚪
  // onInteract: ""
  // hp: 1
  // modifiers: any: 0 | {🔑}: {-1}

  // example KEY
  // emoji: 🔑
  // onInteract: dropEquippable {🔑} x {1}
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
  import {
    map,
    palette,
    currentEmoji,
    interactables,
    equippables,
    consumables,
  } from "../store";

  let defaultBackground = $map.dbg;

  // Add Inventory: ["drop"]
  const types: {
    [key in "Map" | "Background" | "Level"]: Array<keyof Mutations>;
  } = {
    Map: ["spawn", "destroy"],
    Background: ["paint", "erase"],
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
  export let emoji = "";
  export let sequence: Array<SequenceItem> = [];
  export let hp = 1;
  export let points = 1;
  export let modifiers: Array<[number | "any", number]> = [];
  export let isStatic = false;
  export let evolve = new Evolve(false, "", 2);
  export let devolve = new Devolve(false, "");

  // SEQUENCE RELATED
  let type = types.Map[0];
  let duration = 0;
  let index = 0;
  let background = "";

  onMount(() => {
    let obj = $interactables.get(id);

    if (obj) {
      ({ emoji, sequence, hp, points, modifiers, isStatic, evolve, devolve } =
        obj);
    }
  });

  function updateStore() {
    interactables.update(
      id,
      new Interactable(
        emoji,
        sequence,
        hp,
        points,
        modifiers,
        isStatic,
        evolve,
        devolve
      )
    );

    nodesStore.adjustHeight(id, sequence.length, INTERACTABLE_H);
  }

  onDestroy(() => {
    if (emoji == "") {
      interactables.remove(id);
      nodesStore.remove(id);
      return;
    }

    if (evolve.to == "") evolve.enabled = false;
    if (devolve.to == "") devolve.enabled = false;

    modifiers = modifiers.filter((m) => {
      if (m[0] == "any") return true;
      return $equippables.get(m[0])?.emoji != "";
    });
    modifiers = modifiers.filter((m, i) => {
      if (i == 0) return true;
      return m[1] != 0;
    });

    updateStore();
  });

  function addToModifiers(equippableID: number) {
    if (modifiers.some(([id, val]) => id == equippableID)) return;
    if (modifiers.length == 3) {
      notifications.warning("Cannot have more than 3 HP modifiers");
      return;
    }
    modifiers = [...modifiers, [equippableID, 0]];
    updateStore();
  }

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", 1, MIN_DURATION, ""),
    ];
    updateStore();

    [type, duration, index, background] = [types.Map[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    updateStore();
  }

  function removeEmptyModifier(node: any, i: number) {
    modifiers.splice(i, 1);
    modifiers = modifiers;
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

    for (let val of [...$consumables.values(), ...$equippables.values()]) {
      if (
        (typeof val == "string" && val != "" && $currentEmoji == val) ||
        (typeof val == "object" && $currentEmoji == val.emoji)
      ) {
        notifications.warning(
          "An emoji can only have one assigned type. Interactable, Consumable or Equippable"
        );
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

  $: hasInteraction = modifiers.some((m) => m[1] != 0);
  $: eqs = [...$equippables].filter(([id, e]) => e.emoji != "");
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  {#if devolve.enabled}
    <div class="flex scale-75 flex-col items-center justify-center">
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
      class="flex scale-75 flex-col  items-center justify-center"
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
  <div class="form-control w-3/4">
    <label class="label cursor-pointer">
      <span class="label-text">Static</span>
      <input type="checkbox" class="checkbox" bind:checked={isStatic} />
    </label>
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
    <div
      class="flex w-full flex-row items-center justify-center gap-2 pb-6 text-xl"
    >
      <p>Side Effects ({modifiers.length} / 3)</p>
      <div class="dropdown-hover dropdown dropdown-right">
        <label for="" tabindex="0" class="btn text-2xl">+</label>
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box bg-base-100 p-2 shadow "
        >
          {#each eqs as [id, { emoji }]}
            <div
              class="rounded-md p-1 hover:bg-base-200"
              on:click={() => addToModifiers(id)}
            >
              {emoji}
            </div>
          {:else}
            <div class="rounded-md p-1">No equippables defined.</div>
          {/each}
        </ul>
      </div>
      {#if !hasInteraction}
        <div
          class="tooltip"
          data-tip="An interactable needs at least one modifier with positive or negative value to fire events"
        >
          <button class="btn text-2xl text-warning">!</button>
        </div>{/if}
    </div>

    <div class="flex flex-wrap items-center justify-center gap-8 pb-6">
      {#each modifiers as [equippableID, value], i}
        {@const modifierEmoji = $equippables.get(equippableID)?.emoji}
        <div class="relative flex flex-col items-center">
          {#if equippableID == "any"}
            <div class="slot-lg scale-75">
              {equippableID}
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
          {:else if modifierEmoji}
            <button
              class="absolute top-0 right-0 text-lg"
              on:click={() => removeFromModifiers(i)}>🞫</button
            >
            <div class="slot-lg scale-75">
              {modifierEmoji}
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
          {:else}
            <div use:removeEmptyModifier={i} />
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <p class="text-xl">Event Sequence</p>
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
        {:else if s.type == "dropEquippable"}
          <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
        {:else if s.type == "destroy" || s.type == "erase"}
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
        {:else if s.type == "paint"}
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
      <button class="btn ml-1 text-2xl" on:click={addToSequence}>+</button>
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
