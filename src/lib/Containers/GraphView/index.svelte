<script lang="ts">
  import { onMount } from "svelte";
  import { zoom, zoomTransform } from "d3-zoom";
  import { select, selectAll } from "d3-selection";
  import {
    nodesStore,
    nodeSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
  } from "$lib/stores/store";

  import SimpleBezierEdge from "$lib/Edges/SimpleBezierEdge.svelte";
  import EdgeAnchor from "$lib/Edges/EdgeAnchor.svelte";
  import Node from "$lib/Nodes/index.svelte";

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    select,
    selectAll,
  };

  //these are typscripted as any, however they have been transformed inside of store.ts
  // export let nodesStore: any;
  export let derivedEdges: any;

  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;

  let nodesDiv;

  onMount(() => {
    d3.select(`.Edges`).call(d3Zoom).on("dblclick.zoom", null);
    d3.select(`.Nodes`).call(d3Zoom).on("dblclick.zoom", null);
    d3.select(`.Nodes`).on("contextmenu", function (e) {
      e.preventDefault();
      let { x, y, k } = d3.zoomTransform(nodesDiv);
      y = (-y + e.layerY) / k;
      x = (-x + e.layerX) / k;
      nodesStore.spawn("spawner", { x, y });
    });
  });

  let d3Zoom: any = d3
    .zoom()
    .filter(() => !$nodeSelected)
    .scaleExtent([0.4, 2])
    .on("zoom", handleZoom);

  // function to handle zoom events - arguments: d3ZoomEvent
  function handleZoom(e: any): void {
    if (!$movementStore) return;

    //add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
    d3Scale.set(e.transform.k);
    // should not run d3.select below if backgroundStore is false
    if ($backgroundStore) {
      d3.select(`#background`)
        .attr("x", e.transform.x)
        .attr("y", e.transform.y)
        .attr("width", gridSize * e.transform.k)
        .attr("height", gridSize * e.transform.k)
        .selectAll("#dot")
        .attr("x", (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr("y", (gridSize * e.transform.k) / 2 - dotSize / 2)
        .attr("opacity", Math.min(e.transform.k, 1));
    }
    // transform 'g' SVG elements (edge, edge text, edge anchor)
    d3.select(`.Edges g`).attr("transform", e.transform);
    // transform div elements (nodes)
    let transform = d3.zoomTransform(this);
    // selects and transforms all node divs from class 'Node' and performs transformation
    d3.select(`.Node`)
      .style(
        "transform",
        "translate(" +
          transform.x +
          "px," +
          transform.y +
          "px) scale(" +
          transform.k +
          ")"
      )
      .style("transform-origin", "0 0");
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Tab") {
      e.preventDefault();
      changeZ();
    }
  }

  function clickedOnNodes() {
    nodesStore.removeSpawner();
  }

  function clickedOnEdges() {}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<div class={`Nodes`} bind:this={nodesDiv} on:click={clickedOnNodes}>
  <!-- This container is transformed by d3zoom -->
  <div class={`Node`}>
    {#each $nodesStore as node}
      <Node {node} />
    {/each}
  </div>
</div>

<!-- rendering dots on the background depending on the zoom level -->
<svg
  class={`Edges`}
  viewBox="0 0 {$widthStore} {$heightStore}"
  on:click={clickedOnEdges}
>
  <defs>
    <pattern
      id={`background`}
      x="0"
      y="0"
      width={gridSize}
      height={gridSize}
      patternUnits="userSpaceOnUse"
    >
      <circle
        id="dot"
        cx={gridSize / 2 - dotSize / 2}
        cy={gridSize / 2 - dotSize / 2}
        r="0.5"
        style="fill: gray"
      />
    </pattern>
  </defs>

  {#if $backgroundStore}
    <rect width="100%" height="100%" style="fill: url(#background);" />
  {/if}

  <!-- <g> tag defines which edge type to render depending on properties of edge object -->
  <g>
    {#each $derivedEdges as edge}
      <SimpleBezierEdge {edge} />
    {/each}
    {#each $nodesStore as node}
      {@const target = node.targetPosition != undefined}
      {#if !["spawner", "pusher", "merger"].includes(node.component)}
        <EdgeAnchor
          {node}
          x={node.position.x + (target ? 0 : node.width)}
          y={node.position.y + node.height / 2}
        />
      {/if}
    {/each}
  </g>
</svg>

<style>
  .Nodes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .Node {
    color: black; /* remove this once color is set to default via types */
    width: 100%;
    height: 100%;
  }
</style>
