<script>
  import Toast from "./Toast.svelte";
  import { navigating } from "$app/stores";
  import "../app.css";
</script>

{#if $navigating?.from.pathname == "/" && $navigating?.to.pathname == "/game"}
  <div
    class="absolute z-10 flex h-full w-full items-center justify-center bg-white text-2xl"
  >
    LOADING
    <span class="px-2" id="loading">👾</span>
  </div>
{/if}

<Toast />

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
