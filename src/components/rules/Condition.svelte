<script lang="ts">
  import { onDestroy } from "svelte";

  import { colorPalette, events, conditions } from "../../store";

  const props = ["playerBackground"];

  export let id: number;
  export let a: string;
  export let b: string;
  export let eventID: number;
  export let once: boolean;

  const update = () => conditions.updateCondition(id, { a, b, eventID, once });

  function setChildrenInputEvent(node: any) {
    for (let child of node.children) {
      child.addEventListener("change", update);
    }
  }

  onDestroy(() => {
    if ([a, b].includes("") || eventID == 0) {
      conditions.removeCondition(id);
    }
  });
</script>

<section class="noselect rule-card">
  <button
    class="rule-card-close"
    on:click={() => conditions.removeCondition(id)}>❌</button
  >
  <div class="if" use:setChildrenInputEvent>
    <h4>if</h4>
    <select bind:value={a}>
      {#each props as _prop}
        <option value={_prop}>{_prop}</option>
      {/each}
    </select>
    <h4>is</h4>
    <select bind:value={b} style:background={b}>
      {#each $colorPalette as color}
        <option value={color} style:background={color} />
      {/each}
    </select>
  </div>
  <div class="then" use:setChildrenInputEvent>
    <h4>then trigger</h4>
    <select bind:value={eventID}>
      {#each Object.entries($events) as [id, { name }]}
        <option value={id}>{name}</option>
      {/each}
    </select>
  </div>
  <p>
    Trigger once <input
      type="checkbox"
      bind:checked={once}
      on:change={update}
    />
  </p>
</section>

<style>
  p {
    margin: 0;
  }

  section {
    border-color: var(--condition);
  }

  .if,
  .then {
    gap: 5%;
  }

  .if,
  .then {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: clamp(200px, 25vw, 400px);
  }

  h4 {
    padding: 0;
    margin: 0;
  }
</style>
