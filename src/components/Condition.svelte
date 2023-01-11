<script lang="ts">
  import { edgesStore, nodesStore } from "$src/lib/stores/store";
  import { onDestroy, onMount } from "svelte";
  import { notifications } from "../routes/notifications";
  import {
    palette,
    conditions,
    currentEmoji,
    Condition,
    map,
    type ConditionName,
  } from "../store";

  let defaultBackground = $map.dbg;

  const props: Array<ConditionName> = ["playerBackground"];

  // TODO: Component overhaul

  export let id: number;
  let a: ConditionName;
  let b: string;
  let eventID: number;

  onMount(() => {
    let obj = $conditions.get(id);
    if (!obj) return;
    ({ a, b, eventID } = obj);
  });

  function update() {
    conditions.update(id, new Condition(a, b, eventID));

    for (let [_id, _obj] of $conditions.entries()) {
      if (_id == id) continue;
      if (_obj.a == a && _obj.b == b) {
        notifications.warning("Cannot have duplicate conditions");
        b = "";
        conditions.update(id, new Condition(a, b, eventID));
      }
    }
  }

  onDestroy(() => {
    /*
      0 is the default eventID value, which means
      no event has been assigned for the condition
    */

    if ([a, b].includes("") || $conditions.get(id)?.eventID == 0) {
      conditions.remove(id);
      nodesStore.remove(id);
      edgesStore.filter(id);
    }
  });
</script>

<div class="if">
  <h4>if</h4>
  <select class="select" bind:value={a} on:change={update}>
    {#each props as _prop}
      <option value={_prop}>{_prop}</option>
    {/each}
  </select>
</div>
<div class="is">
  {#if a == "playerBackground"}
    <h4>is</h4>
    <select
      class="select"
      bind:value={b}
      style:background={b}
      on:change={update}
    >
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
