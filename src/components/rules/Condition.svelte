<script lang="ts">
  import { onDestroy } from "svelte";
  import { colorPalette, events, conditions } from "../../store";

  const props = ["playerBackground"];

  export let id: string;
  export let a: string;
  export let b: string;
  export let eventID: string;
  export let once: boolean;

  const update = () => {
    console.log("change");
    conditions.update(id, { a, b, eventID, once });
  };

  onDestroy(() => {
    /*
      0 is the default eventID value, which means
      no event has been assigned for the condition
    */
    if (
      [a, b].includes("") ||
      eventID == "" ||
      $events.get(eventID) == undefined
    ) {
      conditions.remove(id);
    }
  });
</script>

<section class="noselect rule-card">
  <button
    class="rule-card-close"
    on:click={() => conditions.remove(id)}>❌</button
  >
  <div class="if">
    <h4>if</h4>
    <select bind:value={a} on:change={update}>
      {#each props as _prop}
        <option value={_prop}>{_prop}</option>
      {/each}
    </select>
    {#if a == "playerBackground"}
      <h4>is</h4>
      <select bind:value={b} style:background={b} on:change={update}>
        {#each [...$colorPalette] as color}
          <option value={color} style:background={color} />
        {/each}
      </select>
    {/if}
  </div>
  <div class="then">
    <h4>then trigger</h4>
    <select bind:value={eventID} on:change={update}>
      {#each [...$events] as [id, { name }]}
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
