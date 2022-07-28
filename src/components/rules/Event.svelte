<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { SequenceItem, Loop } from "../../store";

  export let id: string;
  export let name: string;
  export let sequence: Array<SequenceItem> = [];
  let onEndID = 0;

  // TODO: Implement destroy
  const types = [
    "setBackgroundOf",
    "spawn",
    "destroy",
    "wait",
    "reset",
    "completeLevel",
  ];

  const MIN_INDEX = 0;
  const MAX_INDEX = 256;
  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";
  let trigger = false;

  function generateSequenceItem(_type: string, vals?: any) {
    // TODO: Migrate this solution to loop event
    let newItem: SequenceItem = { type: _type };
    if (vals) {
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
    sequence = [...sequence, generateSequenceItem(type)];
    events.updateEvent(id, { name, sequence });
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromQueue(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    if (sequence.length == 0) {
      events.removeEvent(id);
    } else {
      events.updateEvent(id, { name, sequence });
    }
  }

  function update(i: number | "name") {
    if (i != undefined && i != "name") {
      console.log(sequence[i].type);
      sequence[i] = generateSequenceItem(sequence[i].type, { ...sequence[i] });
    }
    if (type) events.updateEvent(id, { name, sequence });
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
  }

  onDestroy(() => {
    console.log(sequence);
    if (sequence.length == 0) {
      events.removeEvent(id);
    } else if (
      sequence.some((item) => {
        let vals = Object.values(item);
        return vals.includes("") || vals.includes(undefined);
      })
    ) {
      events.removeEvent(id);
    }
  });
  console.log(sequence);
</script>

<section class="noselect rule-card">
  <input
    type="text"
    bind:value={name}
    on:input={() => update("name")}
    placeholder="Event Name"
  />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  {#each sequence as s, i}
    <div>
      <select id="type" bind:value={s.type} on:change={() => update(i)}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if s.type == "spawn"}
        <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
        at
        <input
          type="number"
          bind:value={s.index}
          min={MIN_INDEX}
          max={MAX_INDEX}
          on:change={() => update(i)}
        />
      {:else if s.type == "wait"}
        <input
          type="number"
          bind:value={s.duration}
          min={MIN_DURATION}
          max={MAX_DURATION}
          on:change={() => update(i)}
        /> ms
      {:else if s.type == "setBackgroundOf"}
        <input
          type="number"
          bind:value={s.index}
          min={MIN_INDEX}
          max={MAX_INDEX}
          on:change={() => update(i)}
        />
        to
        <select
          bind:value={s.background}
          style:background={s.background}
          on:change={() => update(i)}
        >
          {#each [...$colorPalette] as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {/if}
      <button id="remove" on:click={() => removeFromQueue(i)}>❌</button>
    </div>
  {/each}
  <div class="inline">
    <select bind:value={type}>
      {#each types as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    <button on:click={addToQueue}>➕</button>
  </div>
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
