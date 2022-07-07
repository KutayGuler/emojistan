<script lang="ts">
  import Collision from "../components/events/Collision.svelte";
  import Click from "../components/events/Click.svelte";
  import { events, hasEmptySlot } from "../store";
</script>

<section>
  <p>The objects will bump into each other by default</p>
  {#each Object.entries($events.collisions) as [id, rule], i}
    <Collision id={+id} {rule} />
  {/each}
  {#if !$hasEmptySlot || Object.keys($events.collisions).length == 0}
    <button on:click={() => events.addCollision("")}>Add Collision</button>
  {/if}
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
</style>
