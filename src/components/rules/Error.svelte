<script lang="ts">
  import { slide } from "svelte/transition";

  let show = false;
  let error: string;

  export function display(_error: string) {
    error = _error;
    show = true;
    setTimeout(() => (show = false), 2000);
  }
</script>

{#if show}
  <div transition:slide|local>{error}</div>
{/if}

<style>
  div {
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
