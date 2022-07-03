<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import { events, currentEmoji, hasEmptySlot } from "../../store";

  onMount(() => {
    $hasEmptySlot = true;
  });

  function removeCollision() {
    // events.removeCollision(id);
  }

  const types = ["bump", "push", "merge"];
  let slots = ["", "", ""];
  let type = types[0];

  let showError = false;
</script>

<section class="noselect">
  <button class="close" on:click={removeCollision}>❌</button>
  <div class="slots">
    {#each { length: 3 } as _, i}
      {#if i == 2}
        <select bind:value={type}>
          {#each types as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
        {#if type == "merge"}
          <div class="slot">
            <div>{slots[2]}</div>
          </div>
        {/if}
      {:else}
        <div class="slot">
          <div>{slots[i]}</div>
        </div>
      {/if}
    {/each}
  </div>
  {#if showError}
    <div transition:slide class="error">
      Inputs cannot be the same with output
    </div>
  {/if}
</section>

<style>
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 25%;
    height: 3vh;
    padding: 5% 3%;
    background-color: var(--dark);
    border: 2px solid black;

    color: white;
  }

  .close {
    position: absolute;
    top: -5px;
    right: -5px;
  }

  .slots {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
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
