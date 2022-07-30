<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { collisions, currentEmoji } from "../../store";

  export let id: string;
  export let rule: string;

  const types = ["push", "merge"];
  let type = types[0];
  let slots = ["", ""];
  let mergeSlot = "";
  let error = "";

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
      error = "Can't have duplicate collisions";
      setTimeout(() => (error = ""), 2000);
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
        error = "Inputs cannot be the same with output";
        setTimeout(() => (error = ""), 2000);
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

<section class="noselect rule-card">
  <button class="rule-card-close" on:click={() => collisions.remove(id)}
    >❌</button
  >
  <div class="slots">
    {#each { length: 3 } as _, i}
      {#if i == 2}
        <select bind:value={type} on:change={() => updateSlot(i)}>
          {#each types as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
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
  {#if error != ""}
    <div transition:slide class="error">
      {error}
    </div>
  {/if}
</section>

<style>
  section {
    border-color: var(--collision);
  }

  .slots {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 5%;
  }

  .slots > :not(.slot) {
    margin-top: 2.5%;
  }

  .slot {
    aspect-ratio: 1;
    width: 4vw;
    height: 4vw;
    background-color: var(--primary);
    border: 2px solid black;
  }

  .slot :nth-child(1) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
