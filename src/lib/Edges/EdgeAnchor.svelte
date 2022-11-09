<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let x: number;
  export let y: number;
</script>

<!-- renders simple half-circle for the anchor point of the edge -->
<circle
  on:click={() => dispatch("linkAttempt")}
  cx={x}
  cy={y}
  r={5}
  stroke="white"
  fill="crimson"
/>

<style>
  circle {
    position: absolute;
    cursor: crosshair;
  }

  circle:hover {
    stroke-width: 2px;
    fill: red;
  }
</style>
