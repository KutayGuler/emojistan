<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy, onMount } from "svelte";
  import { collisions, currentEmoji } from "../../store";
  import Base from "./Base.svelte";

  export let id: string;
  export let rule: string;

  // TODO: Turn rule to array

  const types = ["push", "merge"];
  let type = types[0];
  let slots = ["", ""];
  let mergeSlot = "";
  let error: SvelteComponent;

  onMount(() => {
    if (rule != "") {
      let [x, y, z] = rule.split(",");
      slots = [x, y];
      if (types.includes(z)) {
        type = z;
      } else {
        type = "merge";
        mergeSlot = z;
      }
    }
  });

  function checkCollision(collision: string) {
    if ([...$collisions.values()].includes(collision)) {
      [type, mergeSlot, slots] = [types[0], "", ["", ""]];
      error.display("Can't have duplicate collisions.");
      return;
    }

    if (
      [...$collisions].some(([_id, _rule]) => {
        let rule = _rule.split(",");
        rule.pop();
        return _id != id && (rule.reverse() == rule || slots == rule);
      })
    ) {
      [type, mergeSlot, slots] = [types[0], "", ["", ""]];
      error.display("Merges are bidirectional and can only have one outcome");
      return;
    }

    collisions.update(id, collision);
  }

  function updateSlot(i: number) {
    i == 2 ? (mergeSlot = $currentEmoji) : (slots[i] = $currentEmoji);

    if (type == "merge") {
      if ([...slots, mergeSlot].includes("")) return;
      if (slots.includes(mergeSlot)) {
        mergeSlot = "";
        error.display("Inputs cannot be the same with output");
        return;
      }

      checkCollision(`${slots[0]},${slots[1]},${mergeSlot}`);
      return;
    }

    checkCollision(`${slots[0]},${slots[1]},${type}`);
  }

  onDestroy(() => {
    if (slots.includes("") || (type == "merge" && mergeSlot == "")) {
      collisions.remove(id);
    }
  });
</script>

<Base
  on:remove={() => collisions.remove(id)}
  --border-color="#3a96dd"
  --background="#e9f3fb"
>
  <div class="slots">
    <select bind:value={type}>
      {#each types as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
    {#each { length: 3 } as _, i}
      {#if i == 2}
        {#if type == "merge"}
          <div class="slot" on:click={() => updateSlot(2)}>
            <div>{mergeSlot}</div>
          </div>
        {/if}
      {:else}
        <div class="slot" on:click={() => updateSlot(i)}>
          <div>{slots[i]}</div>
        </div>
      {/if}
    {/each}
  </div>
  <Error bind:this={error} />
</Base>

<style>
  .slots {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .slot {
    aspect-ratio: 1;
    width: 4vw;
    height: 4vw;
    background-color: var(--primary);
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
