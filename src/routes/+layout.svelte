<script>
  import { slide } from "svelte/transition";
  import { navigating } from "$app/stores";

  import "../app.css";

  let loading = false;

  $: if ($navigating) {
    loading = true;
    setTimeout(() => {
      loading = false;
    }, 1000);
  }
</script>

{#if loading}
  <div
    out:slide
    class="absolute z-10 flex h-full w-full items-center justify-center bg-white text-2xl"
  >
    LOADING
    <span class="px-2" id="loading">👾</span>
  </div>
{/if}

<slot />

<style>
  #loading {
    animation: idle 300ms ease-out infinite alternate;
  }
</style>
