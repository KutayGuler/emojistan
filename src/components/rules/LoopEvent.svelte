<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { slide } from "svelte/transition";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem, Loop } from "../../store";

  export let id: number;
  export let name: string;
  export let queue: Array<QueueItem> = [];
  export let loop: Loop;

  let error = "";

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

  function update() {
    // TODO: remove unnecessary object props

    console.log(loop);
    if (loop.start == loop.end) {
      loop.start = 0;
      error = "starting index and ending index cannot be the same";
      setTimeout(() => (error = ""), 2000);
    }
    if (loop.timeGap < MIN_DURATION) loop.timeGap = MIN_DURATION;
    if (loop.iterationNumber < MIN_ITERATION)
      loop.iterationNumber = MIN_ITERATION;

    events.updateEvent(id, { name, queue, loop });
  }

  function updateSlot(i: number) {
    queue[i].emoji = $currentEmoji;
  }

  // TODO: Test on input changes

  onDestroy(() => {
    if (queue.some((item) => Object.values(item).includes(""))) {
      events.removeEvent(id);
    }
  });
</script>

<section class="noselect rule-card">
  <input type="text" bind:value={name} on:input={update} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  <div class="inline">
    start <strong>i</strong> from
    <input
      type="number"
      bind:value={loop.start}
      min={MIN_NUMBER}
      on:input={update}
    />
  </div>
  <div class="step">
    <p>
      <strong>On each step:</strong>
    </p>
    {#each queue as q, i}
      <div>
        <select id="type" bind:value={q.type} on:input={update}>
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
            on:input={update}
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
    <div class="inline">
      <select bind:value={loop.iterationType} on:input={update}>
        {#each ["increment", "decrement"] as operation}
          <option value={operation}>{operation}</option>
        {/each}
      </select>
      <strong>i by</strong>
      <input
        type="number"
        bind:value={loop.iterationNumber}
        min={MIN_ITERATION}
        on:input={update}
      />
    </div>
    <div class="inline">
      Wait <input
        type="number"
        bind:value={loop.timeGap}
        on:change={update}
        min={MIN_DURATION}
        max={MAX_DURATION}
      /> ms
    </div>
  </div>
  <div class="inline">
    end <strong>i</strong> at
    <input
      type="number"
      bind:value={loop.end}
      min={MIN_NUMBER}
      on:input={update}
    />
  </div>
  <!-- <div class="inline">
    Reverse <input
      type="checkbox"
      bind:checked={loop.reverse}
      on:change={update}
    />
  </div> -->
  {#if error != ""}
    <div transition:slide class="error">
      {error}
    </div>
  {/if}
</section>

<style>
  .inline {
    display: inline-block;
  }

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
