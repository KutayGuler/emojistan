<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
</script>

<section
  class="base relative m-4 flex w-full flex-col items-start justify-start rounded-lg border-2 border-solid p-4"
>
  <button
    class="border-3 absolute -top-4 right-2 cursor-pointer rounded border-2"
    on:click={() => dispatch("remove")}
  >
    <svg
      class="w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
  <slot />
</section>

<style>
  .base {
    border-color: var(--border-color);
    background: var(--background);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
  }

  button {
    border-color: var(--border-color);
    background-color: var(--background);
  }
</style>
