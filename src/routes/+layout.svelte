<script>
  import { slide } from "svelte/transition";
  import { navigating, page } from "$app/stores";
  import "../app.css";
</script>

{#if $page.url.pathname == "/" && $navigating}
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
  @keyframes idle {
    100% {
      transform: translateY(-20px);
    }
  }

  #loading {
    animation: idle 300ms ease-out infinite alternate;
  }
</style>
