<script lang="ts">
  import {
    MIN_INDEX,
    MIN_DURATION,
    DURATIONS,
    EVENT_H,
    SIZE,
  } from "../constants";
  import { onDestroy, onMount } from "svelte/internal";
  import {
    palette,
    events,
    currentEmoji,
    map,
    SequenceItem,
    type Mutations,
  } from "../store";

  import { edgesStore, nodesStore } from "$lib/stores/store";

  let defaultBackground = $map.dbg;

  export let id: number;
  let sequence: Array<SequenceItem> = [];

  onMount(() => {
    sequence = $events.get(id) || [];
  });

  const types: Array<keyof Mutations> = [
    "setBackgroundOf",
    "removeBackgroundOf",
    "spawn",
    "destroy",
    "wait",
    "freezePlayer",
    "unfreezePlayer",
    "teleportPlayerTo",
    "resetLevel",
    "completeLevel",
  ];

  let indexes: Array<number> = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
    indexes[i] = i;
  }

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", MIN_DURATION, ""),
    ];
    events.update(id, sequence);
    nodesStore.adjustHeight(id, sequence.length, EVENT_H);

    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    if (sequence.length == 0) {
      events.remove(id);
    } else {
      events.update(id, sequence);
      nodesStore.adjustHeight(id, sequence.length, EVENT_H);
    }
  }

  function update() {
    events.update(id, sequence);
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
    update();
  }

  onDestroy(() => {
    // let newsequence = sequence.filter((item) => {
    //   let vals = Object.values(item);
    //   return !(vals.includes("") || vals.includes(undefined));
    // });

    //

    if (sequence.length == 0) {
      events.remove(id);
      nodesStore.remove(id);
      edgesStore.filter(id);
    }

    // else if (newsequence.length < sequence.length) {
    //   events.update(id, newsequence);
    // }
  });
</script>

{#each sequence as s, i}
  <span>
    <select
      class="select"
      title="event type"
      id="type"
      bind:value={s.type}
      on:change={update}
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
        on:change={update}
      >
        {#each indexes as j}
          <option value={j}>{j}</option>
        {/each}
      </select>
    {:else if s.type == "destroy" || s.type == "teleportPlayerTo" || s.type == "removeBackgroundOf"}
      <select
        class="select"
        title="index"
        id="index"
        bind:value={s.index}
        on:change={update}
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
        on:change={update}
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
        on:change={update}
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
          on:change={update}
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

<style>
  span {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>
