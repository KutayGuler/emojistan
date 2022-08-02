<script>
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<section class="noselect rule-card" transition:slide>
  <button class="rule-card-close" on:click={() => dispatch("remove")}>❌</button
  >
  <slot />
</section>

<style>
  section {
    border-color: var(--border-color);
    background: var(--background);
  }
</style>
