<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem, Loop } from "../../store";

  export let id: number;
  export let name: string;
  export let queue: Array<QueueItem> = [];

  const types = ["setBackgroundOf", "spawn", "wait", "reset", "completeLevel"];

  const MIN_INDEX = 0;
  const MAX_INDEX = 255;
  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;

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
      case "completeLevel":
      case "reset":
        Object.assign(newItem);
        break;
    }
    queue = [...queue, newItem];
    events.updateEvent(id, { name, queue });
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromQueue(i: number) {
    queue.splice(i, 1);
    queue = queue;
    if (queue.length == 0) {
      events.removeEvent(id);
    } else {
      events.updateEvent(id, { name, queue });
    }
  }

  function update() {
    // TODO: remove unnecessary object props
    if (type) events.updateEvent(id, { name, queue });
  }

  function updateNumeric(qIndex: number) {
    let q = queue[qIndex];
    if (q.type == "setBackgroundOf" || q.type == "spawn") {
      // @ts-expect-error
      if (q.index > MAX_INDEX) {
        q.index = MAX_INDEX;
        // @ts-expect-error
      } else if (q.index < MIN_INDEX) {
        q.index = MIN_INDEX;
      }
    } else if (q.type == "wait") {
      // @ts-expect-error
      if (q.duration > MAX_DURATION) {
        q.duration = MAX_DURATION;
      }
      // @ts-expect-error
      else if (q.duration < MIN_DURATION) {
        q.duration = MIN_DURATION;
      }
    }
    events.updateEvent(id, { name, queue });
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
  <input type="text" bind:value={name} on:input={update} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  {#each queue as q, i}
    <div>
      <select id="type" bind:value={q.type} on:input={update}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if q.type == "spawn"}
        <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
        at
        <input
          type="number"
          bind:value={q.index}
          min={MIN_INDEX}
          max={MAX_INDEX}
          on:input={() => updateNumeric(i)}
        />
      {:else if q.type == "wait"}
        <input
          type="number"
          bind:value={q.duration}
          min={MIN_DURATION}
          max={MAX_DURATION}
          on:change={() => updateNumeric(i)}
        /> ms
      {:else if q.type == "setBackgroundOf"}
        <input
          type="number"
          bind:value={q.index}
          min={MIN_INDEX}
          max={MAX_INDEX}
          on:input={() => updateNumeric(i)}
        />
        to
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
