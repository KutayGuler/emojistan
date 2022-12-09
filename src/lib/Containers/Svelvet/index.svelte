<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
  import GraphView from "$lib/Containers/GraphView/index.svelte";
  import { svelvetStore } from "$lib/stores/store";
  import { GRAPH_SIZE } from "$src/constants";
  import type { Edge } from "$src/lib/types";
  import { onMount, afterUpdate } from "svelte";

  // Declaring variables for Svelvet components which will be usable in other files
  export let nodes: Node[];
  export let edges: Edge[];
  export let width: number = GRAPH_SIZE;
  export let height: number = GRAPH_SIZE;
  export let background: boolean = false;
  export let movement: boolean = true;

  // stores (state) within stores, so that we cannot access values from everywhere
  const { widthStore, heightStore, nodesStore, derivedEdges, edgesStore } =
    svelvetStore;

  // sets the state of the store to the values passed in from the Svelvet Component on initial render
  // onMount(() => {
  //   svelvetStore.nodesStore.set(nodes);
  //   svelvetStore.edgesStore.set(edges);
  //   svelvetStore.widthStore.set(width);
  //   svelvetStore.heightStore.set(height);
  //   svelvetStore.backgroundStore.set(background);
  //   svelvetStore.movementStore.set(movement);
  // });
  // enables data reactivity
  // afterUpdate(() => {
  //   svelvetStore.nodesStore.set(nodes);
  //   svelvetStore.edgesStore.set(edges);
  //   svelvetStore.widthStore.set(width);
  //   svelvetStore.heightStore.set(height);
  //   svelvetStore.backgroundStore.set(background);
  //   svelvetStore.movementStore.set(movement);
  // });
</script>

<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
  class="Svelvet shadow-lg"
  style={`width: ${$widthStore}px; height: ${$heightStore}px`}
>
  <GraphView {derivedEdges} />
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
