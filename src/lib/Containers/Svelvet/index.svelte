<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
  import GraphView from "$lib/Containers/GraphView/index.svelte";
  import { GRAPH_SIZE_2XL, GRAPH_SIZE_MD } from "$src/constants";
  import { onMount } from "svelte";

  let graphSize: number;
  let innerWidth: number;

  function resize() {
    if (innerWidth >= 1536) {
      graphSize = GRAPH_SIZE_2XL;
    } else {
      graphSize = GRAPH_SIZE_MD;
    }
  }

  onMount(resize);
</script>

<svelte:window bind:innerWidth on:resize={resize} />
<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
  class="Svelvet shadow-lg"
  style={`width: ${graphSize}px; height: ${graphSize}px`}
>
  <GraphView {graphSize} />
  <p class="absolute right-0 bottom-0 pr-1 text-xs">
    Right click to spawn a Rulebox
  </p>
</div>

<style>
  .Svelvet {
    position: relative;
    overflow: hidden;
    display: grid;
    font-family: "Segoe UI", sans-serif;
    background-color: "white";
  }
</style>
