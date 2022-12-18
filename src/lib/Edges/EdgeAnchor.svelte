<script lang="ts">
  import { linker } from "../stores/store";
  import { svelvetStore } from "../stores/store";
  const { nodesStore } = svelvetStore;

  export let node: Node;
  export let x: number;
  export let y: number;

  function attemptLink() {
    if (linker.link(node.id, node.component, { x, y })) {
      $nodesStore = $nodesStore;
    }
  }
</script>

<!-- renders simple half-circle for the anchor point of the edge -->
<circle
  on:click={attemptLink}
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
