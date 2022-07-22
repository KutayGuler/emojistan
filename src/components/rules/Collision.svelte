<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { collisions, currentEmoji, hasEmptySlot } from "../../store";

  export let id: number;
  export let rule: string;

  const types = ["push", "merge"];
  let type = types[0];
  let slots = ["", ""];
  let mergeSlot = "";
  let error = "";

  onMount(() => {
    if (rule != "") {
      $hasEmptySlot = false;
      let [x, y, z] = rule.split(",");
      slots = [x, y];
      if (types.includes(z)) {
        type = z;
      } else {
        type = "merge";
        mergeSlot = z;
      }
    } else {
      $hasEmptySlot = true;
    }
  });

  function checkCollision(collision: string) {
    if (Object.values($collisions).includes(collision)) {
      [type, mergeSlot, slots] = [types[0], "", ["", ""]];
      $hasEmptySlot = true;
      error = "Can't have duplicate collisions";
      setTimeout(() => (error = ""), 1500);
      return;
    }

    $hasEmptySlot = false;
    collisions.updateCollision(id, collision);
  }

  function updateSlot(i: number) {
    i == 2 ? (mergeSlot = $currentEmoji) : (slots[i] = $currentEmoji);

    if (type == "merge") {
      if ([...slots, mergeSlot].includes("")) return;
      if (slots.includes(mergeSlot)) {
        mergeSlot = "";
        $hasEmptySlot = true;
        error = "Inputs cannot be the same with output";
        setTimeout(() => (error = ""), 1500);
        return;
      }

      checkCollision(`${slots[0]},${slots[1]},${mergeSlot}`);
      return;
    }

    if (slots.includes("")) {
      $hasEmptySlot = true;
      return;
    }

    checkCollision(`${slots[0]},${slots[1]},${type}`);
  }
</script>

<section class="noselect rule-card">
  <button
    class="rule-card-close"
    on:click={() => collisions.removeCollision(id)}>❌</button
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

  .error {
    position: absolute;
    background-color: var(--danger);
    width: 100%;
    height: 5vh;
    bottom: -5vh;
    left: 0;
    border: 2px solid black;
    padding: 2%;
    box-sizing: border-box;
    z-index: 90;
  }
</style>
