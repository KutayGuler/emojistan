<script lang="ts">
  import {
    onMouseMove,
    onRuleboxClick,
    onTouchMove,
    rbxStore,
    rbxSelected,
    rbxIdSelected,
    movementStore,
  } from "$lib/stores/store";
  import {
    consumables,
    equippables,
    interactables,
    mergers,
    pushers,
  } from "$src/store";

  import type { Rulebox } from "$lib/types/types";
  import ContextMenu from "$rbx/ContextMenu.svelte";
  import Interactable from "$rbx/Interactable.svelte";
  import Pusher from "$rbx/Pusher.svelte";
  import Merger from "$rbx/Merger.svelte";
  import Consumable from "$rbx/Consumable.svelte";
  import Equippable from "$rbx/Equippable.svelte";

  export let rbx: Rulebox;
  export let props: any = {};

  $: shouldMove = moving && $movementStore;

  // $rbxSelected is a store boolean that lets GraphView component know if ANY rulebox is selected
  // moving local boolean specific to rulebox selected, to change position of individual rulebox once selected
  let moving = false;
  let moved = false;
</script>

<svelte:window
  on:mousemove={(e) => {
    e.preventDefault();
    if (shouldMove) {
      onMouseMove(e, rbx.id);
      moved = true;
    }
  }}
/>

<div
  class="rulebox"
  style="left: {rbx.position.x}px;
    top: {rbx.position.y}px;
    width: {rbx.width}px;
    height: {rbx.height}px;
    background-color: {rbx.bgColor};"
  id="svelvet-{rbx.id}"
>
  <nav
    class="min-h-6 w-full cursor-move"
    style:display={rbx.type == "ctxMenu" ? "none" : "block"}
    style:background-color={rbx.borderColor}
    on:touchmove={(e) => {
      if (shouldMove) {
        onTouchMove(e, rbx.id);
      }
    }}
    on:touchstart={(e) => {
      e.preventDefault();
      moving = true;
      $rbxSelected = true;
    }}
    on:touchend={(e) => {
      moving = false;
      $rbxSelected = false;
    }}
    on:mousedown={(e) => {
      e.preventDefault();
      moving = true;
      $rbxIdSelected = rbx.id;
      $rbxSelected = true;
    }}
    on:mouseup={(e) => {
      moving = false;
      $rbxSelected = false;
      if (!moved && rbx.id == $rbxIdSelected) {
        onRuleboxClick(e, rbx.id);
      }
      moved = false;
    }}
  />
  <!-- CF #3 -->
  <button
    style:display={rbx.type == "ctxMenu" ? "none" : "flex"}
    style="border-color: {rbx.borderColor}"
    class="absolute top-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 bg-white text-center text-xl"
    on:click={() => {
      rbxStore.remove(rbx.id);

      switch (rbx.type) {
        case "pusher":
          pushers.remove(rbx.id);
          break;
        case "merger":
          mergers.remove(rbx.id);
          break;
        case "consumable":
          consumables.remove(rbx.id);
          break;
        case "equippable":
          equippables.remove(rbx.id);
          break;
        case "interactable":
          interactables.remove(rbx.id);
          break;
        default:
          break;
      }
    }}
  >
    🞫
  </button>
  <!-- CF #2 -->
  {#if rbx.type == "ctxMenu"}
    <ContextMenu position={rbx.position} {...props} />
  {:else if rbx.type == "interactable"}
    <Interactable id={rbx.id} {...props} />
  {:else if rbx.type == "equippable"}
    <Equippable id={rbx.id} {...props} />
  {:else if rbx.type == "consumable"}
    <Consumable id={rbx.id} {...props} />
  {:else if rbx.type == "pusher"}
    <Pusher id={rbx.id} {...props} />
  {:else if rbx.type == "merger"}
    <Merger id={rbx.id} {...props} />
  {/if}
</div>

<style>
  .rulebox {
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
