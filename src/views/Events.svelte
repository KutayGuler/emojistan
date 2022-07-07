<script lang="ts">
  import Collision from "../components/events/Collision.svelte";
  import Click from "../components/events/Click.svelte";
  import { events, hasEmptySlot, staticItems, currentEmoji } from "../store";
</script>

<section>
  <p>Objects will bump into each other by default</p>
  {#each Object.entries($events.collisions) as [id, rule], i}
    <Collision id={+id} {rule} />
  {/each}
  {#if !$hasEmptySlot || Object.keys($events.collisions).length == 0}
    <button on:click={() => events.addCollision("")}>Add Collision</button>
  {/if}
  <p>Static items cannot be moved by players</p>
  <div
    class="statics noselect"
    on:click={() => staticItems.toggleEmoji($currentEmoji, "add")}
  >
    {#each $staticItems as item}
      <div>
        <div>{item}</div>
        <button on:click={() => staticItems.toggleEmoji(item)}>❌</button>
      </div>
    {:else}
      <p>Select an emoji and click here to set it as a static item</p>
    {/each}
  </div>
  <Click />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 1%;
    padding: 1%;
    box-sizing: border-box;
  }

  .statics {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    height: 10vh;
    border: 5px solid black;
  }

  .statics > div {
    display: flex;
    flex-direction: row;
  }

  .statics > p {
    align-self: center;
    text-align: center;
    width: 100%;
  }
</style>
