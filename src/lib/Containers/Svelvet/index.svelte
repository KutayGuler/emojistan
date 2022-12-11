<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
  import GraphView from "$lib/Containers/GraphView/index.svelte";
  import { svelvetStore } from "$lib/stores/store";

  // stores (state) within stores, so that we cannot access values from everywhere
  const { widthStore, heightStore, derivedEdges } = svelvetStore;
</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
  class="Svelvet shadow-lg"
  style={`width: ${$widthStore}px; height: ${$heightStore}px`}
>
  <GraphView {derivedEdges} />
  <p class="absolute right-0 bottom-0">Right click to spawn a component</p>
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
