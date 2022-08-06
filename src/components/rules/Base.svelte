<script>
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const DURATION = 300;

  // outro function for the device that is at the bottom of the list
  // function customScale(node, { key }) {
  //   let ids = [];

  //   for (let device of filteredDevices) {
  //     ids.push(device.id);
  //   }

  //   if (Math.max(...ids, key) == key) {
  //     return scale(node, { key: key, duration: DURATION });
  //   }
  // }
</script>

<section>
  <!-- TODO: reverse color on hover -->
  <button on:click={() => dispatch("remove")}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
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
  section {
    border-color: var(--border-color);
    background: var(--background);

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 5%;
    margin: 5%;
    border-radius: var(--card-br);
    border-width: 3px;
    border-style: solid;
    /* box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px; */
    box-shadow: rgba(149, 157, 165, 0.2) 0px 4px 12px;
  }

  svg {
    width: 24px;
  }

  button {
    border-color: var(--border-color);
    border-radius: var(--cell-br);
    transition: 100ms ease-out;
    position: absolute;
    top: -20%;
    right: 2%;
  }

  button:hover {
    background-color: var(--background);
    cursor: pointer;
  }
</style>
