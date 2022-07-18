<script lang="ts">
  import { colorPalette } from "../../store";

  export let name = "Event0";
  let types = ["setBackgroundOf", "setBackgroundOfPlayer", "spawn", "wait"];

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";

  interface QueueItem {
    type: string;
    background?: string;
    index?: number;
    duration?: number;
    emoji?: string;
  }

  let queue: Array<QueueItem> = [];

  // TODO: Create a function from queue on each change
  // can use onBeforeUpdate
  function createEvent() {
    let fn = () => {};
  }

  function addToQueue() {
    let newItem: QueueItem = { type };
    switch (type) {
      case "setBackgroundOf":
      case "setBackgroundOfPlayer":
        Object.assign(newItem, { index, background });
        break;
      case "emoji":
        Object.assign(newItem, { index, emoji });
        break;
      case "wait":
        Object.assign(newItem, { duration });
        break;
    }
    queue = [...queue, newItem];
    createEvent();
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromQueue(i: number) {
    queue.splice(i, 1);
    queue = queue;
  }
</script>

<section style="noselect rule-card">
  <strong>{name}</strong>
  <button class="rule-card-close" on:click={() => {}}>❌</button>
  {#each queue as q, i}
    <div>
      <select bind:value={q.type}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if q.type == "setBackgroundOf"}
        <input type="number" bind:value={q.index} min={0} max={256} /> to
        <select bind:value={q.background} style:background={q.background}>
          {#each $colorPalette as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {:else if q.type == "setBackgroundOfPlayer"}
        to <select bind:value={q.background} style:background={q.background}>
          {#each $colorPalette as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {:else if q.type == "wait"}
        <input type="number" bind:value={q.duration} max={10000} /> ms
      {/if}
      <button on:click={() => removeFromQueue(i)}>❌</button>
    </div>
  {/each}
  <select bind:value={type}>
    {#each types as t}
      <option value={t}>{t}</option>
    {/each}
  </select>
  {#if type == "setBackgroundOf"}
    <input type="number" bind:value={index} min={0} max={256} /> to
    <select bind:value={background} style:background>
      {#each $colorPalette as color}
        <option value={color} style:background={color} />
      {/each}
    </select>
  {:else if type == "wait"}
    <input type="number" bind:value={duration} max={10000} /> ms
  {/if}
  <button on:click={addToQueue}>➕</button>
</section>
