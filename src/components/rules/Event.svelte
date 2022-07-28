<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem, Loop } from "../../store";

  export let id: string;
  export let name: string;
  export let queue: Array<QueueItem> = [];
  let onEndID = 0;

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
  let trigger = false;

  function generateQueueItem(_type: string, vals?: any) {
    // TODO: Fix update bug
    let newItem: QueueItem = { type: _type };
    if (vals && !Object.values(vals).includes(undefined)) {
      let { index, background, emoji, duration } = vals;
      switch (_type) {
        case "setBackgroundOf":
        case "spawn":
          if (index > MAX_INDEX) {
            index = MAX_INDEX;
          } else if (index < MIN_INDEX) {
            index = MIN_INDEX;
          }
          if (_type == "spawn") {
            Object.assign(newItem, { index, emoji });
          } else {
            Object.assign(newItem, { index, background });
          }
          break;
        case "wait":
          if (duration > MAX_DURATION) {
            duration = MAX_DURATION;
          } else if (duration < MIN_DURATION) {
            duration = MIN_DURATION;
          }
          Object.assign(newItem, { duration });
          break;
        case "completeLevel":
        case "reset":
        default:
          Object.assign(newItem);
          break;
      }
    } else {
      switch (_type) {
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
        default:
          Object.assign(newItem);
          break;
      }
    }
    console.log(newItem);
    return newItem;
  }

  function addToQueue() {
    queue = [...queue, generateQueueItem(type)];
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

  function update(i: number, extra: any) {
    console.log(extra);
    // TODO: remove unnecessary object props
    if (i != undefined || i != -1) {
      console.log(queue[i].type);
      queue[i] = generateQueueItem(queue[i].type, { ...queue });
    }
    if (type) events.updateEvent(id, { name, queue });
  }

  function updateSlot(i: number) {
    queue[i].emoji = $currentEmoji;
  }

  onDestroy(() => {
    if (queue.some((item) => Object.values(item).includes(""))) {
      events.removeEvent(id);
    }
  });
  console.log(queue);
</script>

<section class="noselect rule-card">
  <input type="text" bind:value={name} on:input={() => update(-1, "")} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  {#each queue as q, i}
    <div>
      <select id="type" bind:value={q.type} on:change={() => update(i, q.type)}>
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
          on:change={() => update(i, q.type)}
        />
      {:else if q.type == "wait"}
        <input
          type="number"
          bind:value={q.duration}
          min={MIN_DURATION}
          max={MAX_DURATION}
          on:change={() => update(i, q.type)}
        /> ms
      {:else if q.type == "setBackgroundOf"}
        <input
          type="number"
          bind:value={q.index}
          min={MIN_INDEX}
          max={MAX_INDEX}
          on:change={() => update(i, q.type)}
        />
        to
        <select
          bind:value={q.background}
          style:background={q.background}
          on:change={() => update(i, q.type)}
        >
          {#each [...$colorPalette] as color}
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
    <strong>Trigger on complete</strong>
    <input type="checkbox" bind:checked={trigger} />
  </div>
  {#if trigger}
    <select bind:value={onEndID}>
      {#each [...$events] as [_id, { name }]}
        {#if id != _id}
          <option value={_id}>{name}</option>
        {/if}
      {/each}
    </select>
  {/if}
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
