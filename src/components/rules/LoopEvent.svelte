<script lang="ts">
  // DATA
  import { MIN_INDEX, MAX_INDEX } from "../../constants";
  import { onDestroy } from "svelte/internal";
  import { colorPalette, events, currentEmoji } from "../../store";

  // TYPES
  import type { SvelteComponent } from "svelte/internal";
  import type { SequenceItem, Loop } from "../../store";

  // COMPONENTS
  import Base from "./Base.svelte";
  import Error from "./Error.svelte";

  export let id: string;
  export let name: string;
  export let sequence: Array<SequenceItem> = [];
  export let loop: Loop;

  let error: any;

  const types = ["setBackgroundOf", "removeBackgroundOf", "spawn", "destroy"];

  const MIN_DURATION = 50;
  const MAX_DURATION = 10000;
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

  onDestroy(() => {
    if (sequence.length == 0) {
      events.remove(id);
    } else if (sequence.some((item) => Object.values(item).includes(""))) {
      events.remove(id);
    }
  });
</script>

<Base
  on:remove={() => events.remove(id)}
  --border-color="#ffc83d"
  --background="#fff3d6"
>
  <input
    type="text"
    bind:value={name}
    on:input={() => update("name")}
    placeholder="Loop Event Name"
  />
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
    <div class="inline">
      <select bind:value={type}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      <button on:click={addToSequence}>➕</button>
    </div>
    <br />
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
    <br />
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
</Base>

<style>
  .inline {
    display: inline-block;
  }

  .step {
    border: 2px solid black;
  }
</style>
