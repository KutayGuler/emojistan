<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import {
    palette,
    events,
    loopEvents,
    conditions,
    currentEmoji,
    Condition,
    type A,
  } from "../store";

  const props: Array<A> = ["playerBackground", "playerInteractsWith"];

  export let id: number;
  let a: A;
  let b: string;
  let eventID: number;
  let defaultBackground: string;

  onMount(() => {
    let r: any = document.querySelector(":root");
    let compStyle = getComputedStyle(r);
    defaultBackground = compStyle.getPropertyValue("--default-background");
    let obj = $conditions.get(id);
    if (!obj) return;
    ({ a, b, eventID } = obj);
  });

  function update() {
    conditions.update(id, new Condition(a, b, eventID));

    for (let [_id, _obj] of $conditions.entries()) {
      if (_id == id) continue;
      // if (JSON.stringify(obj) == JSON.stringify(_obj)) {
      //   error.display("Cannot have duplicate conditions");
      //   eventID = "";
      //   obj.eventID = "";
      //   conditions.update(id, obj);
      //   return;
      // }
    }
  }

  onDestroy(() => {
    /*
      0 is the default eventID value, which means
      no event has been assigned for the condition
    */
    if (
      [a, b].includes("") ||
      eventID == undefined ||
      $events.get(eventID) == undefined ||
      $loopEvents.get(eventID) == undefined ||
      $events.get(eventID)?.length == 0 ||
      $loopEvents.get(eventID)?.sequence.length == 0
    ) {
      conditions.remove(id);
    }
  });
</script>

<div class="if">
  <h4>if</h4>
  <select bind:value={a} on:change={update}>
    {#each props as _prop}
      <option value={_prop}>{_prop}</option>
    {/each}
  </select>
  {#if a == "playerInteractsWith"}
    <div class="slot" on:click={() => (b = $currentEmoji)}>{b}</div>
  {/if}
</div>
<div class="is">
  {#if a == "playerBackground"}
    <h4>is</h4>
    <select bind:value={b} style:background={b} on:change={update}>
      <!-- TODO: Shouldn't be able to add global color as condition color -->
      <!-- TODO: Check if this is working as intended -->
      {#each [...$palette].filter((color) => color != defaultBackground) as color}
        <option value={color} style:background={color} />
      {/each}
    </select>
  {/if}
</div>

<style>
  .if,
  .is {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
</style>
