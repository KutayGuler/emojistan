<script lang="ts">
  import { onMount } from "svelte";
  import { zoom, zoomTransform } from "d3-zoom";
  import { select, selectAll } from "d3-selection";
  import { findOrCreateStore, linker } from "$lib/stores/store";
  import { Node as INode } from "$src/lib/types";

  import SimpleBezierEdge from "$lib/Edges/SimpleBezierEdge.svelte";
  import EdgeAnchor from "$lib/Edges/EdgeAnchor.svelte";
  import Node from "$lib/Nodes/index.svelte";
  import { conditions, events } from "$src/store";

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    select,
    selectAll,
  };

  //these are typscripted as any, however they have been transformed inside of store.ts
  export let nodesStore: any;
  export let derivedEdges: any;
  export let key: string;

  // here we lookup the store using the unique key
  const svelvetStore = findOrCreateStore(key);
  const {
    edgesStore,
    nodeSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
  } = svelvetStore;

  function removeEdge(e) {
    let id = e.detail;
    console.log($edgesStore);
    $edgesStore = $edgesStore.filter((edge) => id != edge.id);
  }

  function generateID() {
    return Math.max(...$nodesStore.map((n) => n.id), 0) + 1;
  }

  function removeNode({ detail }) {
    let { id, component } = detail;
    switch (component) {
      case "container":
      case "spawner":
        break;
      case "condition":
        conditions.remove(id);
        break;
      case "event":
        events.remove(id);
        break;
    }
    console.log("BEFORE:", $nodesStore);
    $edgesStore = $edgesStore.filter((e) => !e.id.includes(id.toString()));
    $nodesStore = $nodesStore.filter((n) => n.id != id);
    $nodesStore = $nodesStore;
    console.log("AFTER:", $nodesStore);
  }

  function spawnNode({ detail }) {
    let id = generateID();
    let { component, position, receiver, value } = detail;
    switch (component) {
      case "container":
      case "spawner":
        break;
      case "condition":
        conditions.add(id, value);
        break;
      case "event":
        events.add(id, value);
        break;
    }
    $nodesStore.push(new INode(id, component, position, receiver));
    $nodesStore = $nodesStore;
    console.log($nodesStore);
  }

  function attemptLink(node: Node) {
    let type: "source" | "target" =
      node.sourcePosition != undefined ? "source" : "target";
    if (linker.link(key, node.id, type)) {
      $nodesStore = $nodesStore;
    }
  }

  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;

  let nodesDiv;

  onMount(() => {
    d3.select(`.Edges-${key}`).call(d3Zoom).on("dblclick.zoom", null);
    d3.select(`.Nodes-${key}`).call(d3Zoom).on("dblclick.zoom", null);
    d3.select(`.Nodes-${key}`).on("contextmenu", function (e) {
      e.preventDefault();
      for (let n of $nodesStore) {
        if (n.component == "spawner") {
          removeNode({ detail: { id: n.id, component: n.component } });
          break;
        }
      }
      let { x, y, k } = d3.zoomTransform(nodesDiv);
      y = (-y + e.layerY) / k;
      x = (-x + e.layerX) / k;
      spawnNode({
        detail: { component: "spawner", position: { x, y } },
      });
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
      d3.select(`#background-${key}`)
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
    d3.select(`.Edges-${key} g`).attr("transform", e.transform);
    // transform div elements (nodes)
    let transform = d3.zoomTransform(this);
    // selects and transforms all node divs from class 'Node' and performs transformation
    d3.select(`.Node-${key}`)
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

  let z1 = "z-index: 1;";
  let svgStyle = "";
</script>

<button on:click={() => (svgStyle = svgStyle == z1 ? "" : z1)}
  >{svgStyle == z1 ? "EDIT NODES" : "EDIT EDGES"}</button
>

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<div class={`Nodes Nodes-${key}`} bind:this={nodesDiv}>
  <!-- This container is transformed by d3zoom -->
  <div class={`Node Node-${key}`}>
    {#each $nodesStore as node}
      <Node {node} {key} on:spawnNode={spawnNode} on:removeNode={removeNode} />
    {/each}
  </div>
</div>

<!-- rendering dots on the background depending on the zoom level -->
<svg
  style={svgStyle}
  class={`Edges Edges-${key}`}
  viewBox="0 0 {$widthStore} {$heightStore}"
>
  <defs>
    <pattern
      id={`background-${key}`}
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
    <rect width="100%" height="100%" style="fill: url(#background-{key});" />
  {/if}

  <!-- <g> tag defines which edge type to render depending on properties of edge object -->
  <g>
    {#each $derivedEdges as edge}
      <SimpleBezierEdge {edge} on:removeEdge={removeEdge} />
    {/each}
    {#each $nodesStore as node}
      {@const target = node.targetPosition != undefined}
      <EdgeAnchor
        on:linkAttempt={() => attemptLink(node)}
        x={node.position.x + (target ? 0 : node.width)}
        y={node.position.y + node.height / 2}
      />
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

  button {
    z-index: 2;
    position: absolute;
    top: 10px;
  }
</style>
