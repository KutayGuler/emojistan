<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { slide } from "svelte/transition";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { SequenceItem, Loop } from "../../store";

  export let id: string;
  export let name: string;
  export let sequence: Array<SequenceItem> = [];
  export let loop: Loop;

  let error = "";

  const types = ["setBackgroundOf", "spawn", "destroy"];

  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;
  const MIN_INDEX = 0;
  const MAX_INDEX = 256;
  const MIN_ITERATION = 1;
  const MAX_ITERATION = 16;

  let type = types[0];
  let index = 0;
  let background = "";
  let emoji = "";

  function addToSequence() {
    let newItem: SequenceItem = { type };
    switch (type) {
      case "setBackgroundOf":
        Object.assign(newItem, { index, background });
        break;
      case "spawn":
        Object.assign(newItem, { index, emoji });
        break;
    }
    sequence = [...sequence, newItem];
    events.update(id, { name, sequence, loop });
    [type, index, background] = [types[0], 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    if (sequence.length == 0) {
      events.remove(id);
    } else {
      events.update(id, { name, sequence, loop });
    }
  }

  function update() {
    console.log(loop);
    if (loop.start == loop.end) {
      loop.start = 0;
      error = "starting index and ending index cannot be the same";
      setTimeout(() => (error = ""), 2000);
    }
    if (loop.start < MIN_INDEX || loop.start > MAX_INDEX) {
      loop.start = MIN_INDEX;
    }
    if (loop.end < MIN_INDEX || loop.end > MAX_INDEX) {
      loop.end = MIN_INDEX;
    }
    if (loop.timeGap < MIN_DURATION || loop.timeGap > MAX_DURATION) {
      loop.timeGap = MIN_DURATION;
    }
    if (
      loop.iterationNumber < MIN_ITERATION ||
      loop.iterationNumber > MAX_ITERATION
    ) {
      loop.iterationNumber = MIN_ITERATION;
    }

    events.update(id, { name, sequence, loop });
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
  }

  // TODO: Test on input changes

  onDestroy(() => {
    if (sequence.length == 0) {
      events.remove(id);
    } else if (sequence.some((item) => Object.values(item).includes(""))) {
      events.remove(id);
    }
  });
</script>

<section class="noselect rule-card">
  <input
    type="text"
    bind:value={name}
    on:input={update}
    placeholder="Loop Event Name"
  />
  <button class="rule-card-close" on:click={() => events.remove(id)}>❌</button>
  <label>
    start <strong>i</strong> from
    <input
      type="number"
      bind:value={loop.start}
      min={MIN_INDEX}
      max={MAX_INDEX}
      on:input={update}
    />
  </label>
  <div class="step">
    <p>
      <strong>On each step:</strong>
    </p>
    {#each sequence as q, i}
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
            {#each [...$colorPalette] as color}
              <option value={color} style:background={color} />
            {/each}
          </select>
        {/if}
        <button id="remove" on:click={() => removeFromSequence(i)}>❌</button>
      </div>
    {/each}
    <select bind:value={type}>
      {#each types as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <button on:click={addToSequence}>➕</button>
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
        max={MAX_ITERATION}
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
  <label>
    end <strong>i</strong> at
    <input
      type="number"
      bind:value={loop.end}
      min={MIN_INDEX}
      max={MAX_INDEX}
      on:input={update}
    />
  </label>
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

  .step {
    border: 2px solid black;
  }
</style>
