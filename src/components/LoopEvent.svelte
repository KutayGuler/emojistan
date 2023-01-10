<script lang="ts">
  // DATA
  import {
    MIN_INDEX,
    MIN_DURATION,
    MIN_ITERATION,
    LOOPEVENT_H,
    DURATIONS,
    SIZE,
  } from "../constants";
  import { notifications } from "$src/routes/notifications";
  import { onDestroy, onMount } from "svelte/internal";
  import { palette, loopEvents, currentEmoji, type TLoopEvent } from "../store";
  import { edgesStore, nodesStore } from "$lib/stores/store";

  // TYPES
  import { SequenceItem, type Loop, type Mutations } from "../store";

  export let id: number;
  let sequence: Array<SequenceItem> = [];
  let loop: Loop = {
    start: 0,
    end: SIZE,
    iterationNumber: 1,
    iterationType: "increment",
    timeGap: 50,
    reverse: false,
  };

  let indexes: Array<number> = [];
  let iterations: Array<number> = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
    indexes[i] = i;
  }

  for (let i = 0; i < SIZE; i++) {
    iterations[i] = i + 1;
  }

  const types: Array<keyof Mutations> = [
    "setBackgroundOf",
    "removeBackgroundOf",
    "trailBackground",
    "spawn",
    "destroy",
    "trail",
  ];

  let type = types[0];
  let index = 0;
  let background = "";
  let emoji = "";

  onMount(() => {
    let obj = $loopEvents.get(id);
    if (!obj) return;
    ({ sequence, loop } = obj as TLoopEvent);
  });

  function validateLoop() {
    if (loop.start == loop.end) {
      if (loop.iterationType == "increment") {
        loop.start = 0;
        loop.end = SIZE;
      } else {
        loop.start = SIZE;
        loop.end = 0;
      }
      notifications.warning(
        "starting index and ending index cannot be the same"
      );
    }

    if (loop.iterationType == "increment") {
      if (loop.start > loop.end) {
        notifications.warning(
          "starting index cannot be bigger than ending index on increment"
        );
        loop.start = 0;
        loop.end = SIZE;
      }

      if (loop.iterationNumber > loop.end) {
        loop.iterationNumber = MIN_ITERATION;
      }
    } else if (loop.iterationType == "decrement") {
      if (loop.end > loop.start) {
        notifications.warning(
          "ending index cannot be bigger than starting index on decrement"
        );
        loop.start = SIZE;
        loop.end = 0;
      }

      if (loop.iterationNumber > loop.start) {
        loop.iterationNumber = MIN_ITERATION;
      }
    }

    loopEvents.update(id, { sequence, loop });
  }

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", MIN_DURATION, ""),
    ];
    validateLoop();
    loopEvents.update(id, { sequence, loop });
    nodesStore.adjustHeight(id, sequence.length, LOOPEVENT_H);
    [type, index, background] = [types[0], 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    if (sequence.length == 0) {
      loopEvents.remove(id);
    } else {
      loopEvents.update(id, { sequence, loop });
      nodesStore.adjustHeight(id, sequence.length, LOOPEVENT_H);
    }
  }

  function update(i?: number | "name") {
    if (i != undefined && i != "name") {
      let { type, index, background, duration } = sequence[i];
      sequence[i] = new SequenceItem(type, index, background, duration, "");
    }
    if (type) {
      validateLoop();
    }
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
  }

  onDestroy(() => {
    // let newsequence = sequence.filter((item) => {
    //   let vals = Object.values(item);
    //   return !(vals.includes("") || vals.includes(undefined));
    // });

    if (sequence.length == 0) {
      loopEvents.remove(id);
      nodesStore.remove(id);
      edgesStore.filter(id);
    }

    // else if (newsequence.length < sequence.length) {
    //   loopEvents.update(id, { loop, sequence: newsequence });
    // }
  });
</script>

<label>
  start <strong>i</strong> from
  <select
    title="loop starting index"
    bind:value={loop.start}
    on:change={() => update()}
  >
    {#each indexes as i}
      <option value={i}>{i}</option>
    {/each}
  </select>
</label>
<div class="step w-full">
  {#each sequence as q, i}
    <div>
      <select title="event type" bind:value={q.type} on:input={() => update(i)}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if q.type == "spawn" || q.type == "trail"}
        <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
        at<strong>i</strong>
      {:else if q.type == "destroy"}
        <p>destroy</p>
      {:else if q.type == "removeBackgroundOf"}
        <p>background</p>
      {:else if q.type == "setBackgroundOf" || "trailBackground"}
        <strong>i</strong> to
        <select
          title="color"
          bind:value={q.background}
          style:background={q.background}
          on:input={() => update(i)}
        >
          {#each [...$palette] as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {/if}
      <button id="remove" on:click={() => removeFromSequence(i)}>❌</button>
    </div>
  {/each}
  <div class="inline">
    <select title="event type" bind:value={type}>
      {#each types as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <button on:click={addToSequence}>➕</button>
  </div>
  <br />
  <div class="inline">
    <select
      title="iteration type"
      bind:value={loop.iterationType}
      on:change={() => update()}
    >
      {#each ["increment", "decrement"] as operation}
        <option value={operation}>{operation}</option>
      {/each}
    </select>
    <strong>i by</strong>
    <select
      title="loop iteration number"
      bind:value={loop.iterationNumber}
      on:change={() => update()}
    >
      {#each iterations as i}
        <option value={i}>{i}</option>
      {/each}
    </select>
  </div>
  <br />
  <div class="inline">
    Wait <select
      title="loop iteration number"
      bind:value={loop.timeGap}
      on:change={() => update()}
    >
      {#each [0, ...DURATIONS] as d}
        <option value={d}>{d}</option>
      {/each}
    </select> ms
  </div>
</div>
<label>
  end <strong>i</strong> at
  <select
    title="loop iteration number"
    bind:value={loop.end}
    on:change={() => update()}
  >
    {#each indexes as i}
      <option value={i}>{i}</option>
    {/each}
  </select>
</label>

<style>
  .inline {
    display: inline-block;
  }

  .step {
    border: 2px solid black;
  }
</style>
