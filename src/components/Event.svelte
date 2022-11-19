<script lang="ts">
  import {
    MIN_INDEX,
    MAX_INDEX,
    MIN_DURATION,
    MAX_DURATION,
  } from "../constants";
  import { onDestroy } from "svelte/internal";
  import {
    palette,
    events,
    currentEmoji,
    SequenceItem,
    type Mutations,
  } from "../store";

  export let id: number;
  export let sequence: Array<SequenceItem> = [];

  const types: Array<keyof Mutations> = [
    "setBackgroundOf",
    "removeBackgroundOf",
    "spawn",
    "destroy",
    "wait",
    "resetLevel",
    "completeLevel",
  ];

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";

  function updateSequenceItem(_type: keyof Mutations, vals?: any) {
    let { index, background, emoji, duration } = vals;
    return new SequenceItem(_type, index, background, emoji, duration);
  }

  function addToSequence() {
    sequence = [
      ...sequence,
      new SequenceItem(type, MIN_INDEX, "", MIN_DURATION, ""),
    ];
    events.update(id, { sequence });
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromSequence(i: number) {
    sequence.splice(i, 1);
    sequence = sequence;
    if (sequence.length == 0) {
      events.remove(id);
    } else {
      events.update(id, { sequence });
    }
  }

  function update(i: number) {
    if (i != undefined) {
      sequence[i] = updateSequenceItem(sequence[i].type, { ...sequence[i] });
    }
    if (type) events.update(id, { sequence });
  }

  function updateSlot(i: number) {
    sequence[i].emoji = $currentEmoji;
  }

  onDestroy(() => {
    let newsequence = sequence.filter((item) => {
      let vals = Object.values(item);
      return !(vals.includes("") || vals.includes(undefined));
    });

    if (sequence.length == 0) {
      events.remove(id);
    } else if (newsequence.length < sequence.length) {
      events.update(id, { sequence: newsequence });
    }
  });

  // TODO: 0 to 256 and 256 to 0 etc.
  // TODO: can also try dropdown
  function incrementIndex(i: number) {
    if (sequence[i].index + 1 >= MAX_INDEX) return;
    sequence[i].index += 1;
  }

  function decrementIndex(i: number) {
    if (sequence[i].index - 1 <= MIN_INDEX) return;
    sequence[i].index -= 1;
  }

  function incrementDuration(i: number) {
    if (sequence[i].duration + 1 >= MAX_DURATION) return;
    sequence[i].duration += 1;
  }

  function decrementDuration(i: number) {
    if (sequence[i].duration - 1 <= MIN_DURATION) return;
    sequence[i].duration -= 1;
  }
</script>

{#each sequence as s, i}
  <span>
    <select
      title="event type"
      id="type"
      bind:value={s.type}
      on:change={() => update(i)}
    >
      {#each types as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    {#if s.type == "spawn"}
      <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
      at
      <p>{s.index}</p>
      <button on:click={() => incrementIndex(i)}>+</button>
      <button on:click={() => decrementIndex(i)}>-</button>
    {:else if s.type == "destroy"}
      <p>{s.index}</p>
      <button on:click={() => incrementIndex(i)}>+</button>
      <button on:click={() => decrementIndex(i)}>-</button>
    {:else if s.type == "wait"}
      <p>{s.duration} ms</p>
      <button on:click={() => incrementDuration(i)}>+</button>
      <button on:click={() => decrementDuration(i)}>-</button>
    {:else if s.type == "setBackgroundOf" || s.type == "removeBackgroundOf"}
      <p>{s.index}</p>
      <button on:click={() => incrementIndex(i)}>+</button>
      <button on:click={() => decrementIndex(i)}>-</button>
      {#if s.type == "setBackgroundOf"}
        to
        <select
          title="color"
          bind:value={s.background}
          style:background={s.background}
          on:change={() => update(i)}
        >
          {#each [...$palette] as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {/if}
    {/if}
    <button id="remove" on:click={() => removeFromSequence(i)}>❌</button>
  </span>
{/each}
<label>
  <select title="event type" bind:value={type}>
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
