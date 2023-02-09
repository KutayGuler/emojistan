<script lang="ts">
  import { onMount } from "svelte";
  // @ts-expect-error
  import { zoom, zoomTransform } from "d3-zoom";
  // @ts-expect-error
  import { select, selectAll } from "d3-selection";
  import {
    rbxStore,
    rbxSelected,
    backgroundStore,
    movementStore,
    widthStore,
    heightStore,
    d3Scale,
  } from "$lib/stores/store";
  import Rulebox from "$lib/Rulebox.svelte";

  // leveraging d3 library to zoom/pan
  let d3 = {
    zoom,
    zoomTransform,
    select,
    selectAll,
  };

  // declaring the grid and dot size for d3's transformations and zoom
  const gridSize = 15;
  const dotSize = 10;

  let ruleboxesDiv: HTMLDivElement;

  onMount(() => {
    d3.select(`.Ruleboxes`).call(d3Zoom).on("dblclick.zoom", null);
    d3.select(`.Ruleboxes`).on("contextmenu", function (e: MouseEvent) {
      e.preventDefault();
      let { x, y, k } = d3.zoomTransform(ruleboxesDiv);
      // @ts-expect-error
      y = (-y + e.layerY) / k; // e.layerX is experimental and not recommended
      // @ts-expect-error
      x = (-x + e.layerX) / k; // e.layerY is experimental and not recommended
      rbxStore.spawn("ctxMenu", { x, y });
    });
  });

  let d3Zoom: any = d3
    .zoom()
    .filter(() => !$rbxSelected)
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
    // @ts-expect-error
    let transform = d3.zoomTransform(this);
    // selects and transforms all rbx divs from class 'Rbx' and performs transformation
    d3.select(`.Rbx`)
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

  function clickedOnRuleboxes() {
    rbxStore.removeCtxMenu();
  }
</script>

<!-- This is the container that holds GraphView and we have disabled right click functionality to prevent a sticking behavior -->
<div class={`Ruleboxes`} bind:this={ruleboxesDiv} on:click={clickedOnRuleboxes}>
  <!-- This container is transformed by d3zoom -->
  <div class={`Rbx`}>
    {#each $rbxStore as rbx}
      <Rulebox {rbx} />
    {/each}
  </div>
</div>

<!-- rendering dots on the background depending on the zoom level -->
<svg class={`Edges`} viewBox="0 0 {$widthStore} {$heightStore}">
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
</svg>

<style>
  .Ruleboxes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .Rbx {
    color: black; /* remove this once color is set to default via types */
    width: 100%;
    height: 100%;
  }
</style>
