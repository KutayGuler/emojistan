<script lang="ts">
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  // import type { CollisionKey } from "../../store";
  import { events, currentEmoji, hasEmptySlot } from "../../store";

  export let id: number;

  onMount(() => {
    $hasEmptySlot = true;
  });

  function setEmoji(key: string) {
    $events.collisions[id][key].emoji = $currentEmoji;
    let output = $events.collisions[id].output.emoji;

    if (output != null) {
      let input1 = $events.collisions[id].input1.emoji;
      let input2 = $events.collisions[id].input2.emoji;
      if (input1 == output || input2 == output) {
        $events.collisions[id][key].emoji = null;
        $hasEmptySlot = true;
        showError = true;
        setTimeout(() => (showError = false), 2000);
        return;
      }
    }

    $hasEmptySlot = Object.values($events.collisions).some(
      (obj) =>
        obj.input1.emoji == "" ||
        obj.input2.emoji == "" ||
        obj.output.emoji == ""
    );
  }

  function removeCollision() {
    events.removeCollision(id);
  }

  let showError = false;
</script>

<section class="noselect">
  <button class="close" on:click={removeCollision}>❌</button>
  <div class="slots">
    {#each Object.entries($events.collisions[id]) as [key, obj], i}
      <div class="slot">
        <div on:click={() => setEmoji(key)}>
          {obj.emoji || ""}
        </div>
        {#if key != "output"}
          <div class="destroy-on-collision" title="destroy on collision">
            💥<input
              checked={true}
              type="checkbox"
              bind:value={$events.collisions[id][key].destroy}
            />
          </div>
        {/if}
      </div>
      {#if i == 0}<div>➕</div>{/if}
      {#if i == 1}<div>➡️</div>{/if}
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

  .destroy-on-collision {
    display: flex;
    flex-direction: row;
    position: absolute;
    bottom: -100%;
  }
</style>
