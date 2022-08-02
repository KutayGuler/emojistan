<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { SequenceItem, Loop } from "../../store";

  export let id: string;
  export let name: string;
  export let sequence: Array<SequenceItem> = [];
  export let loop: Loop;

  let error: SvelteComponent;

  const types = ["setBackgroundOf", "removeBackgroundOf", "spawn", "destroy"];

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

  function validateInput(input: number, min: number, max: number) {
    if (input == undefined) return input;
    if (input > max) {
      return max;
    } else if (input < min) {
      return min;
    }
  }

  function validateLoop() {
    if (loop.start == loop.end) {
      if (loop.iterationType == "increment") {
        loop.start = 0;
        loop.end = 16;
      } else {
        loop.start = 16;
        loop.end = 0;
      }
      error.display("starting index and ending index cannot be the same");
    }

    if (loop.iterationType == "increment") {
      if (loop.start > loop.end) {
        error.display(
          "starting index cannot be bigger than ending index on increment"
        );
        loop.start = 0;
        loop.end = 16;
      }

      if (loop.iterationNumber > loop.end) {
        loop.iterationNumber = MIN_ITERATION;
      }
    } else if (loop.iterationType == "decrement") {
      if (loop.end > loop.start) {
        error.display(
          "ending index cannot be bigger than starting index on decrement"
        );
        loop.start = 16;
        loop.end = 0;
      }

      if (loop.iterationNumber > loop.start) {
        loop.iterationNumber = MIN_ITERATION;
      }
    }

    if (loop.start < MIN_INDEX) loop.start = MIN_INDEX;
    if (loop.start > MAX_INDEX) loop.start = MAX_INDEX;

    if (loop.end < MIN_INDEX) loop.end = MIN_INDEX;
    if (loop.end > MAX_INDEX) loop.end = MAX_INDEX;

    if (loop.timeGap < MIN_DURATION) loop.timeGap = MIN_DURATION;
    if (loop.timeGap > MAX_DURATION) loop.timeGap = MAX_DURATION;

    if (loop.iterationNumber < MIN_ITERATION) {
      loop.iterationNumber = MIN_ITERATION;
    }

    if (loop.iterationNumber > MAX_ITERATION) {
      loop.iterationNumber = MAX_ITERATION;
    }
    // TODO: Out of bounds
    // if increment, start(i) cannot be bigger than end(i)
    // and vice versa for decrement
    events.update(id, { name, sequence, loop });
  }

  function generateSequenceItem(_type: string, vals?: any) {
    let newItem: SequenceItem = { type: _type };
    if (vals) {
      let { index, background, emoji } = vals;
      index = validateInput(index, MIN_INDEX, MAX_INDEX);
      switch (_type) {
        case "setBackgroundOf":
          Object.assign(newItem, { index, background });
          break;
        case "spawn":
          console.log("here");
          Object.assign(newItem, { index, emoji });
          break;
        case "destroy":
        case "removeBackgroundOf":
          Object.assign(newItem, { index });
          break;
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
        default:
          Object.assign(newItem);
          break;
      }
    }

    return newItem;
  }

  function addToSequence() {
    sequence = [...sequence, generateSequenceItem(type)];
    validateLoop();
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

  function update(i?: number | "name") {
    console.log("update");
    if (i != undefined && i != "name") {
      sequence[i] = generateSequenceItem(sequence[i].type, { ...sequence[i] });
    }
    if (type) {
      validateLoop();
    }
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
    on:input={() => update("name")}
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
      on:input={() => update()}
    />
  </label>
  <div class="step">
    <p>
      <strong>On each step:</strong>
    </p>
    {#each sequence as q, i}
      <div>
        <select id="type" bind:value={q.type} on:input={() => update(i)}>
          {#each types as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
        {#if q.type == "spawn"}
          <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
          at<strong>i</strong>
        {:else if q.type == "destroy"}
          <p>destroy</p>
        {:else if q.type == "removeBackgroundOf"}
          <p>background</p>
        {:else if q.type == "setBackgroundOf"}
          <strong>i</strong> to
          <select
            bind:value={q.background}
            style:background={q.background}
            on:input={() => update(i)}
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
      <select bind:value={loop.iterationType} on:change={() => update()}>
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
        on:input={() => update()}
      />
    </div>
    <div class="inline">
      Wait <input
        type="number"
        bind:value={loop.timeGap}
        on:change={() => update()}
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
      on:input={() => update()}
    />
  </label>
  <Error bind:this={error} />
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
