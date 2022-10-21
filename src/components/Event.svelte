<script lang="ts">
  import { MIN_INDEX, MAX_INDEX } from "../constants";
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../store";
  import type { SequenceItem } from "../store";

  export let id: string;
  export let sequence: Array<SequenceItem> = [];
  let onEndID = 0;

  const types = [
    "setBackgroundOf",
    "removeBackgroundOf",
    "equipInteractedItem",
    "equipItem",
    "consumeEquippedItem",
    // "fireProjectile",
    "spawn",
    "destroy",
    "wait",
    "resetLevel",
    "completeLevel",
  ];

  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";
  let trigger = false;

  function validateInput(
    input: number,
    min: number,
    max: number
  ): number | undefined {
    if (input == undefined) return input;
    if (input > max) {
      return max;
    } else if (input < min) {
      return min;
    } else {
      return input;
    }
  }

  function generateSequenceItem(_type: string, vals?: any) {
    let newItem = { type: _type };
    if (vals) {
      let { index, background, emoji, duration } = vals;
      index = validateInput(index, MIN_INDEX, MAX_INDEX);
      duration = validateInput(duration, MIN_DURATION, MAX_DURATION);
      switch (_type) {
        case "setBackgroundOf":
          Object.assign(newItem, { index, background });
          break;
        case "spawn":
          Object.assign(newItem, { index, emoji });
          break;
        case "destroy":
        case "removeBackgroundOf":
          Object.assign(newItem, { index });
          break;
        case "equipItem":
          Object.assign(newItem, { emoji });
          break;
        case "wait":
          Object.assign(newItem, { duration });
          break;
        // case "fireProjectile":
        // // Add extra duration for rate of fire
        //   Object.assign(newItem, { emoji, duration });
        //   break;
        case "consumeEquippedItem":
        case "equipInteractedItem":
        case "completeLevel":
        case "resetLevel":
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
        case "destroy":
        case "removeBackgroundOf":
          Object.assign(newItem, { index });
          break;
        case "equipItem":
          Object.assign(newItem, { emoji });
          break;
        case "wait":
          Object.assign(newItem, { duration });
          break;
        // case "fireProjectile":
        //   Object.assign(newItem, { emoji, duration });
        //   break;
        case "consumeEquippedItem":
        case "equipInteractedItem":
        case "completeLevel":
        case "resetLevel":
        default:
          Object.assign(newItem);
          break;
      }
    }

    return newItem;
  }

  function addToSequence() {
    sequence = [...sequence, generateSequenceItem(type)];
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
      sequence[i] = generateSequenceItem(sequence[i].type, { ...sequence[i] });
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

  // TODO: Polish UI
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
      <input
        type="number"
        bind:value={s.index}
        min={MIN_INDEX}
        max={MAX_INDEX}
        on:change={() => update(i)}
      />
    {:else if s.type == "equipItem"}
      <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
    {:else if s.type == "destroy"}
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
    {:else if s.type == "fireProjectile"}
      <div class="slot" on:click={() => updateSlot(i)}>{s.emoji || ""}</div>
      <!-- Add direction and origin -->
      <input
        type="number"
        bind:value={s.duration}
        min={MIN_DURATION}
        max={MAX_DURATION}
        on:change={() => update(i)}
      /> ms
    {:else if s.type == "setBackgroundOf" || s.type == "removeBackgroundOf"}
      <input
        type="number"
        bind:value={s.index}
        min={MIN_INDEX}
        max={MAX_INDEX}
        on:change={() => update(i)}
      />
      {#if s.type == "setBackgroundOf"}
        to
        <select
          title="color"
          bind:value={s.background}
          style:background={s.background}
          on:change={() => update(i)}
        >
          {#each [...$colorPalette] as color}
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

<!-- <label>
      <strong>Trigger on complete</strong>
      <input type="checkbox" bind:checked={trigger} />
      {#if trigger}
        <select bind:value={onEndID}>
          {#each [...$events] as [_id, { name }]}
            {#if id != _id}
              <option value={_id}>{name}</option>
            {/if}
          {/each}
        </select>
      {/if}
    </label> -->
<style>
  span {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
</style>
