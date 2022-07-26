<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem, Loop } from "../../store";

  export let id: number;
  export let name: string;
  export let queue: Array<QueueItem> = [];
  export let loop: Loop;

  const types = ["setBackgroundOf", "spawn"];

  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;
  const MIN_NUMBER = 0;
  const MIN_ITERATION = 1;

  let type = types[0];
  let index = 0;
  let background = "";
  let emoji = "";

  // TODO: Show alert on:
  // end and start is same

  function addToQueue() {
    let newItem: QueueItem = { type };
    switch (type) {
      case "setBackgroundOf":
        Object.assign(newItem, { index, background });
        break;
      case "spawn":
        Object.assign(newItem, { index, emoji });
        break;
    }
    queue = [...queue, newItem];
    events.updateEvent(id, { name, queue, loop });
    [type, index, background] = [types[0], 0, ""];
  }

  function removeFromQueue(i: number) {
    queue.splice(i, 1);
    queue = queue;
    if (queue.length == 0) {
      events.removeEvent(id);
    } else {
      events.updateEvent(id, { name, queue, loop });
    }
  }

  function updateEvent() {
    // TODO: remove unnecessary object props

    if (loop.timeGap < MIN_DURATION) loop.timeGap = MIN_DURATION;
    if (loop.iterationNumber < MIN_ITERATION)
      loop.iterationNumber = MIN_ITERATION;

    events.updateEvent(id, { name, queue, loop });
  }

  function updateSlot(i: number) {
    queue[i].emoji = $currentEmoji;
  }

  onDestroy(() => {
    if (queue.some((item) => Object.values(item).includes(""))) {
      events.removeEvent(id);
    }
  });
</script>

<section class="noselect rule-card">
  <input type="text" bind:value={name} on:input={updateEvent} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  <p>
    start <strong>i</strong> from
    <input type="number" bind:value={loop.start} min={MIN_NUMBER} />
  </p>
  <div class="step">
    <p>
      <strong>On each step:</strong>
    </p>
    {#each queue as q, i}
      <div>
        <select id="type" bind:value={q.type} on:input={updateEvent}>
          {#each types as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
        {#if q.type == "spawn"}
          <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
          at<strong>i</strong>
        {:else if q.type == "setBackgroundOf"}
          <strong>i</strong> to
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
    <p>
      <select bind:value={loop.iterationType}>
        {#each ["increment", "decrement"] as operation}
          <option value={operation}>{operation}</option>
        {/each}
      </select>
      <strong>i by</strong>
      <input
        type="number"
        bind:value={loop.iterationNumber}
        min={MIN_ITERATION}
      />
    </p>
    <p>
      Wait <input
        type="number"
        bind:value={loop.timeGap}
        on:change={updateEvent}
        min={MIN_DURATION}
        max={MAX_DURATION}
      /> ms
    </p>
  </div>
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

  .step {
    border: 2px solid black;
  }
</style>
