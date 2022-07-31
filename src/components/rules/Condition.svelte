<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy } from "svelte";
  import { colorPalette, events, conditions, currentEmoji } from "../../store";

  const props = ["playerBackground", "playerInteractedWith"];

  export let id: string;
  export let a: string;
  export let b: string;
  export let _b: string | "any";
  export let eventID: string;

  let error: SvelteComponent;

  const update = () => {
    console.log([...$conditions.values()]);
    if ([...$conditions.values()].includes({ a, b, _b, eventID })) {
      console.log("nibba this exists");
      error.display("Cannot have duplicate conditions");
      return;
    }
    conditions.update(id, { a, b, _b, eventID });
  };

  function generateCondition() {
    // TODO: Create a object and only then update conditions
  }

  // TODO: remove duplicated if statements

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
  <button class="rule-card-close" on:click={() => conditions.remove(id)}
    >❌</button
  >
  <div class="if">
    <h4>if</h4>
    <select bind:value={a} on:input={update}>
      {#each props as _prop}
        <option value={_prop}>{_prop}</option>
      {/each}
    </select>
    {#if a == "playerBackground"}
      <h4>is</h4>
      <select bind:value={b} style:background={b} on:input={update}>
        {#each [...$colorPalette] as color}
          <option value={color} style:background={color} />
        {/each}
      </select>
    {:else if a == "playerInteractedWith"}
      <div class="slot" on:click={() => (b = $currentEmoji)}>{b}</div>
    {/if}
  </div>
  {#if a == "playerInteractedWith"}
    <div class="while">
      <h4>while equipped with</h4>
      <div class="slot" on:click={() => (_b = $currentEmoji || "any")}>
        {_b}
      </div>
    </div>
  {/if}
  <div class="then">
    <h4>then trigger</h4>
    <select bind:value={eventID} on:input={update}>
      {#each [...$events] as [id, { name }]}
        <option value={id}>{name}</option>
      {/each}
    </select>
  </div>
  <Error bind:this={error} />
</section>

<style>
  section {
    border-color: var(--condition);
  }

  .if,
  .then {
    gap: 5%;
  }

  .if,
  .then,
  .while {
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
