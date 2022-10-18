<script lang="ts">
  import Error from "./Error.svelte";
  import Base from "./Base.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy } from "svelte";
  import {
    colorPalette,
    events,
    loopEvents,
    conditions,
    currentEmoji,
  } from "../../store";

  const props = ["playerBackground", "playerInteractsWith"];

  export let id: string;
  export let a: string;
  export let b: string;
  export let _b: string | "any";
  export let eventID: string;
  export let disabled = false;

  let error: SvelteComponent;

  const update = () => {
    if (disabled) return;
    let obj = generateCondition();
    conditions.update(id, obj);

    for (let [_id, _obj] of $conditions.entries()) {
      if (_id == id) continue;
      if (JSON.stringify(obj) == JSON.stringify(_obj)) {
        error.display("Cannot have duplicate conditions");
        eventID = "";
        obj.eventID = "";
        conditions.update(id, obj);
        return;
      }
    }
  };

  function generateCondition() {
    return { a, b, _b, eventID };
  }

  onDestroy(() => {
    /*
      0 is the default eventID value, which means
      no event has been assigned for the condition
    */
    if (disabled) return;
    if (
      [a, b].includes("") ||
      eventID == "" ||
      $events.get(eventID) == undefined ||
      $loopEvents.get(eventID) == undefined ||
      $events.get(eventID)?.sequence.length == 0 ||
      $loopEvents.get(eventID)?.sequence.length == 0
    ) {
      conditions.remove(id);
    }
  });

  // TODO: Shouldn't be able to add global color as condition color
  // TODO: Check if color palette is being saved on database
</script>

<Base
  {disabled}
  on:remove={() => conditions.remove(id)}
  --border-color="#644292"
  --background="#cfc0e3"
>
  {#if disabled}
    <div class="if">
      <h4>if</h4>
      <p>playerBackground</p>
      <h4>is</h4>
      <div class="color" />
    </div>
    <div class="then">
      <h4>then</h4>
      <p>EventName</p>
    </div>
  {:else}
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
      {:else if a == "playerInteractsWith"}
        <div class="slot" on:click={() => (b = $currentEmoji)}>{b}</div>
      {/if}
    </div>
    {#if a == "playerInteractsWith"}
      <div class="while">
        <h4>while equipped with</h4>
        <div class="slot" on:click={() => (_b = $currentEmoji || "any")}>
          {_b}
        </div>
      </div>
    {/if}
    <div class="then">
      <h4>then trigger</h4>
      <select bind:value={eventID} on:change={update}>
        {#each [...$events, ...$loopEvents] as [id, { name }]}
          <option value={id}>{name}</option>
        {/each}
      </select>
    </div>
    <Error bind:this={error} />
  {/if}
</Base>

<style>
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
    width: 100%;
    box-sizing: border-box;
    padding: 0 20%;
  }

  h4 {
    padding: 0;
    margin: 0;
  }

  .color {
    min-width: 30px;
    min-height: 30px;
    background-color: red;
  }
</style>
