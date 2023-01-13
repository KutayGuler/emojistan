<script lang="ts">
  export let node: Node;
  export let x: number;
  export let y: number;
</script>

<!-- renders simple half-circle for the anchor point of the edge -->
<circle cx={x} cy={y} r={5} stroke="white" fill="crimson" />

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
