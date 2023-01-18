<script lang="ts">
  import {
    onMouseMove,
    onNodeClick,
    onTouchMove,
    nodesStore,
    nodeSelected,
    nodeIdSelected,
    movementStore,
  } from "$lib/stores/store";
  import { interactables, merges, pushes } from "$src/store";

  import type { Node } from "$lib/types/types";
  import Interactable from "$components/Interactable.svelte";
  import Spawner from "$components/Spawner.svelte";
  import Pusher from "$components/Pusher.svelte";
  import Merger from "$components/Merger.svelte";
  import {
    INTERACTABLE_BORDER,
    MERGER_BORDER,
    PUSHER_BORDER,
  } from "$src/constants";

  export let node: Node;

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
    background-color: {node.bgColor};"
  id="svelvet-{node.id}"
>
  <nav
    class="min-h-6 w-full cursor-move"
    style:display={node.component == "spawner" ? "none" : "block"}
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
  <!-- CF #3 -->
  <button
    style="border-color: {node.borderColor}"
    class="absolute top-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 bg-white text-center text-xl"
    on:click={() => {
      nodesStore.remove(node.id);

      switch (node.component) {
        case "pusher":
          pushes.remove(node.id);
          break;
        case "merger":
          merges.remove(node.id);
          break;
        case "interactable":
          interactables.remove(node.id);
          break;
        default:
          break;
      }
    }}
  >
    🞫
  </button>
  <!-- CF #2 -->
  {#if node.component == "spawner"}
    <Spawner
      --pusher={PUSHER_BORDER}
      --merger={MERGER_BORDER}
      --interactable={INTERACTABLE_BORDER}
      position={node.position}
    />
  {:else if node.component == "interactable"}
    <Interactable id={node.id} />
  {:else if node.component == "pusher"}
    <Pusher id={node.id} />
  {:else if node.component == "merger"}
    <Merger id={node.id} />
  {/if}
</div>

<style>
  .Node {
    transition: height 150ms ease-out;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    user-select: none;
    overscroll-behavior: auto;
    font-size: 14px;
    text-align: center;
    box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
  }
</style>
