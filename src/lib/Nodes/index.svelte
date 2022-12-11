<script lang="ts">
  import Condition from "$components/Condition.svelte";
  import LoopEvent from "$components/LoopEvent.svelte";
  import Container from "$components/Container.svelte";
  import Spawner from "$components/Spawner.svelte";
  import Event from "$components/Event.svelte";

  import { svelvetStore } from "$lib/stores/store";
  import type { Node } from "$lib/types/types";
  import { conditions, events, loopEvents } from "$src/store";
  import Merger from "$components/Merger.svelte";

  export let node: Node;

  const {
    onMouseMove,
    onNodeClick,
    onTouchMove,
    nodesStore,
    edgesStore,
    nodeSelected,
    nodeIdSelected,
    movementStore,
  } = svelvetStore;

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

<div
  class="Node"
  style="left: {node.position.x}px;
    top: {node.position.y}px;
    width: {node.width}px;
    height: {node.height}px;
    background-color: {node.bgColor};
    border-color: {node.borderColor};"
  id="svelvet-{node.id}"
>
  <nav
    style:background-color={node.borderColor}
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
      console.log(e.button);
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
    style="border-color: {node.borderColor}"
    class="absolute -top-1 right-1 cursor-pointer rounded border-2 bg-white"
    on:click={() => {
      nodesStore.remove(node.id);
      edgesStore.filter(node.id);

      switch (node.component) {
        case "condition":
          conditions.remove(node.id);
          break;
        case "event":
          events.remove(node.id);
          break;
        case "loopEvent":
          loopEvents.remove(node.id);
          break;
        default:
          break;
      }
    }}
  >
    <svg
      class="w-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      stroke="black"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
  <div
    class="flex flex-col {node.component == 'spawner' ? 'w-full bg-white' : ''}"
  >
    {#if node.component == "container"}
      <Container id={node.id} />
    {:else if node.component == "condition"}
      <Condition id={node.id} />
    {:else if node.component == "merger"}
      <Merger id={node.id} />
    {:else if node.component == "event"}
      <Event id={node.id} />
    {:else if node.component == "loopEvent"}
      <LoopEvent id={node.id} />
    {:else if node.component == "spawner"}
      <Spawner position={node.position} />
    {/if}
  </div>
</div>

<style>
  nav {
    /* background: red; */
    position: absolute;
    top: 0px;
    width: 100%;
    cursor: move;
    height: 10px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .Node {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
    overscroll-behavior: auto;
    font-size: 14px;
    text-align: center;
    border: solid 1px black;
    border-radius: 5px;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
