<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let disabled = false;
</script>

<section class="base">
  {#if !disabled}
    <button on:click={() => dispatch("remove")}>
      <svg
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
  {/if}
  <slot />
</section>

<style>
  .base {
    --padding: clamp(8px, 5%, 32px);
    border-color: var(--border-color);
    background: var(--background);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: var(--padding);
    margin: var(--padding);
    border-radius: var(--card-br);
    border-width: 3px;
    border-style: solid;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
  }

  :global(.base *) {
    font-size: 1.2rem;
  }

  svg {
    width: 24px;
  }

  button {
    border-color: var(--border-color);
    border-radius: var(--cell-br);
    position: absolute;
    top: -20%;
    right: 2%;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--background);
  }
</style>
