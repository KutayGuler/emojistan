<script lang="ts">
  import { findOrCreateStore, linker } from "$lib/stores/store";
  import type { Node } from "$lib/types/types";
  import { createEventDispatcher } from "svelte";
  import EdgeAnchor from "../Edges/EdgeAnchor.svelte";

  const dispatch = createEventDispatcher();

  export let node: Node;
  export let key: string;

  const _store = findOrCreateStore(key);
  console.log(_store);

  const {
    edgesStore,
    nodesStore,
    onMouseMove,
    onNodeClick,
    onTouchMove,
    nodeSelected,
    nodeIdSelected,
    movementStore,
  } = findOrCreateStore(key);

  function attemptLink() {
    let success = linker.link(key, node.id);
    if (success) {
      dispatch("linked");
    }
  }

  function removeSelf() {
    dispatch("remove");
    $edgesStore = $edgesStore.filter((e) => !e.id.includes(node.id.toString()));
    $nodesStore = $nodesStore.filter((n) => n.id != node.id);
  }

  $: shouldMove = moving && $movementStore;

  // $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
  // moving local boolean specific to node selected, to change position of individual node once selected
  let moving = false;
  let moved = false;
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (shouldMove) {
      onMouseMove(e, node.id);
      moved = true;
    }
  }}
/>

<!-- TODO: Prevent moving the grid on mousedown move -->

<div
  class="Node"
  style="left: {node.position.x}px;
    top: {node.position.y}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};
    border-radius: {node.borderRadius}px;
    color: {node.textColor};"
  id="svelvet-{node.id}"
>
  <nav
    on:touchmove={(e) => {
      if (shouldMove) {
        onTouchMove(e, node.id);
      }
    }}
    on:touchstart={(e) => {
      e.preventDefault();
      moving = true;
      $nodeSelected = true;
    }}
    on:touchend={(e) => {
      moving = false;
      $nodeSelected = false;
    }}
    on:mousedown={(e) => {
      e.preventDefault();
      moving = true;
      $nodeIdSelected = node.id;
      $nodeSelected = true;
    }}
    on:mouseup={(e) => {
      moving = false;
      $nodeSelected = false;
      if (!moved && node.id == $nodeIdSelected) {
        onNodeClick(e, node.id);
      }
      moved = false;
    }}
  />
  <button
    class="border-3 absolute -top-4 right-2 cursor-pointer rounded border-2"
    on:click={removeSelf}
  >
    <svg
      class="w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
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
  {#if !$edgesStore.some((edge) => edge.source == node.id || edge.target == node.id)}
    <svg
      fill="transparent"
      style="position: absolute; left: {node.width - 10}px; top: {node.height /
        2}px  width: 10px; height: 10px; z-index: 2;"
      viewBox="0 0 10 10"
    >
      <EdgeAnchor x={5} y={5} on:linkAttempt={attemptLink} />
    </svg>
  {/if}
  <div
    style="width: {node.width}"
    class="flex flex-col items-start justify-start rounded-lg border-2 border-solid p-4"
  >
    <slot />
  </div>
</div>
<!-- TODO: Fix width & height problem -->

<!-- TODO: Fix z-index problem -->
<style>
  button {
    border-color: var(--border-color);
    background-color: var(--background);
  }

  nav {
    cursor: move;
    background: red;
    height: 10px;
  }

  .Node {
    position: absolute;
    display: grid;
    user-select: none;
    justify-content: center;
    overscroll-behavior: auto;
    align-items: center;
    font-size: 14px;
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
