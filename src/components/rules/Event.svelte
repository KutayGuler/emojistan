<script lang="ts">
  import { colorPalette, events, currentEmoji } from "../../store";
  import type { QueueItem } from "../../store";

  export let id: number;
  export let name: string;
  export let queue: Array<QueueItem> = [];

  const types = [
    "setPlayer",
    "setPlayerBackground",
    "setBackgroundOf",
    "spawn",
    "waitFor",
  ];

  let type = types[0];
  let duration = 0;
  let index = 0;
  let background = "";
  let emoji = "";

  function addToQueue() {
    let newItem: QueueItem = { type };
    switch (type) {
      case "setBackgroundOf":
      case "setPlayerBackground":
        Object.assign(newItem, { index, background });
        break;
      case "setPlayer":
      case "spawn":
        Object.assign(newItem, { index, emoji });
        break;
      case "waitFor":
        Object.assign(newItem, { duration });
        break;
    }
    queue = [...queue, newItem];
    events.updateEvent(id, { name, queue });
    [type, duration, index, background] = [types[0], 0, 0, ""];
  }

  function removeFromQueue(i: number) {
    queue.splice(i, 1);
    queue = queue;
    if (queue.length == 0) events.removeEvent(id);
  }

  const updateEvent = () => events.updateEvent(id, { name, queue });

  function setChildrenInputEvent(node: any) {
    for (let child of node.children) {
      if (child.id == "remove") {
        child.addEventListener("click", updateEvent);
      } else {
        child.addEventListener("input", updateEvent);
      }
    }
  }

  function updateSlot(i: number) {
    queue[i].emoji = $currentEmoji;
  }
  // TODO: Fix styles not being applied
</script>

<section style="noselect rule-card">
  <input type="text" bind:value={name} on:input={updateEvent} />
  <button class="rule-card-close" on:click={() => events.removeEvent(id)}
    >❌</button
  >
  {#each queue as q, i}
    <div use:setChildrenInputEvent>
      <select bind:value={q.type}>
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
      {#if q.type == "setPlayer"}
        <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
      {:else if q.type == "spawn"}
        <div class="slot" on:click={() => updateSlot(i)}>{q.emoji || ""}</div>
        at
        <input type="number" bind:value={q.index} min={0} max={256} />
      {:else if q.type == "waitFor"}
        <input type="number" bind:value={q.duration} max={10000} /> ms
      {:else if q.type == "setBackgroundOf"}
        <input type="number" bind:value={q.index} min={0} max={256} />
        to
        <select bind:value={q.background} style:background={q.background}>
          {#each $colorPalette as color}
            <option value={color} style:background={color} />
          {/each}
        </select>
      {:else if q.type == "setPlayerBackground"}
        {#if $colorPalette.length == 0}
          <p>Color palette is empty</p>
        {:else}
          <select bind:value={q.background} style:background={q.background}>
            {#each $colorPalette as color}
              <option value={color} style:background={color} />
            {/each}
          </select>
        {/if}
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
  .slot {
    display: inline-block;
    aspect-ratio: 1;
    width: 2.5vw;
    height: 2.5vw;
    background-color: var(--primary);
    border: 2px solid black;
  }
</style>
