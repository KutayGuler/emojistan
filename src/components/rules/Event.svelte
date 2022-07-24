<script lang="ts">
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem, Loop } from "../../store";

  export let id: number;
  export let name: string;
  export let queue: Array<QueueItem> = [];
  export let isLoop = false;
  export let loop: Loop;

  const types = ["setBackgroundOf", "spawn", "wait", "reset"];
  const loopTypes = ["setBackgroundOf", "spawn"];

  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;
  const MIN_NUMBER = 0;
  const MIN_ITERATION = 1;

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";

  function addToQueue() {
    let newItem: QueueItem = { type };
    switch (type) {
      case "setBackgroundOf":
        Object.assign(newItem, { index, background });
        break;
      case "spawn":
        Object.assign(newItem, { index, emoji });
        break;
      case "wait":
        Object.assign(newItem, { duration });
        break;
      case "reset":
        Object.assign(newItem);
        break;
    }
    queue = [...queue, newItem];
    events.updateEvent(id, { name, queue, isLoop, loop });
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromQueue(i: number) {
    queue.splice(i, 1);
    queue = queue;
    if (queue.length == 0) {
      events.removeEvent(id);
    } else {
      events.updateEvent(id, { name, queue, isLoop, loop });
    }
  }

  function updateEvent() {
    // TODO: remove unnecessary object props

    if (isLoop) {
      if (loop.timeGap < MIN_DURATION) loop.timeGap = MIN_DURATION;
      if (loop.iterationNumber < MIN_ITERATION)
        loop.iterationNumber = MIN_ITERATION;
      for (let i = 0; i < queue.length; i++) {
        if (!loopTypes.includes(queue[i].type)) {
          removeFromQueue(i);
        }
      }
    }
    events.updateEvent(id, { name, queue, isLoop, loop });
  }

  function updateSlot(i: number) {
    queue[i].emoji = $currentEmoji;
  }
  // TODO: Fix styles not being applied
</script>

<section style="noselect rule-card">
  <input type="text" bind:value={name} on:input={updateEvent} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  <p>
    Loop <input type="checkbox" bind:checked={isLoop} on:change={updateEvent} />
  </p>
  {#if isLoop}
    <p>
      start <strong>i</strong> from
      <input type="number" bind:value={loop.start} min={MIN_NUMBER} />
    </p>
    <select bind:value={loop.iterationType}>
      {#each ["increment", "decrement"] as operation}
        <option value={operation}>{operation}</option>
      {/each}
    </select>
    <input
      type="number"
      bind:value={loop.iterationNumber}
      min={MIN_ITERATION}
    />
    <p>
      end <strong>i</strong> at
      <input type="number" bind:value={loop.end} min={MIN_NUMBER} />
    </p>
    <p>
      Reverse <input
        type="checkbox"
        bind:checked={loop.reverse}
        on:change={updateEvent}
      />
    </p>
    <p>
      Time gap: <input
        type="number"
        bind:value={loop.timeGap}
        on:change={updateEvent}
        min={MIN_DURATION}
        max={MAX_DURATION}
      /> ms
    </p>
  {/if}
  {#each queue as q, i}
    <div>
      <select id="type" bind:value={q.type} on:input={updateEvent}>
        {#each isLoop ? loopTypes : types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if q.type == "spawn"}
        <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
        at
        {#if isLoop}
          <strong>i</strong>
        {:else}
          <input
            type="number"
            bind:value={q.index}
            min={0}
            max={256}
            on:input={updateEvent}
          />
        {/if}
      {:else if q.type == "wait" && !isLoop}
        <input
          type="number"
          bind:value={q.duration}
          max={MAX_DURATION}
          on:input={updateEvent}
        /> ms
      {:else if q.type == "setBackgroundOf"}
        {#if isLoop}
          <strong>i</strong>
        {:else}
          <input
            type="number"
            bind:value={q.index}
            min={0}
            max={256}
            on:input={updateEvent}
          />
        {/if}
        to
        <select
          bind:value={q.background}
          style:background={q.background}
          on:input={updateEvent}
        >
          {#each $colorPalette as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {/if}
      <button id="remove" on:click={() => removeFromQueue(i)}>❌</button>
    </div>
  {/each}
  <select bind:value={type}>
    {#each types as t}
      <option value={t}>{t}</option>
    {/each}
  </select>
  <button on:click={addToQueue}>➕</button>
</section>

<style>
  section {
    border-color: var(--event);
  }

  .slot {
    display: inline-block;
    width: 2.5vw;
    height: 2.5vw;
    background-color: var(--primary);
    border: 2px solid black;
  }
</style>
