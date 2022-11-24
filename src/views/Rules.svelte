<script lang="ts">
  // SVELTE
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import type { Node, Edge } from "$lib/types/types";

  // DATA
  import { statics, currentEmoji, modal } from "../store";

  // COMPONENTS
  import Svelvet from "$lib/index";
  import Palette from "$components/Palette.svelte";

  // TODO: Fill them up with localStorage saves
  const initialNodes: Array<Node> = [];
  const initialEdges: Array<Edge> = [];

  const flipParams = { duration: 300 };
</script>

<!-- TODO: Fix nodes moving together -->

<Palette />
<Svelvet nodes={initialNodes} edges={initialEdges} background />
<div class="flex w-1/6 flex-col justify-start">
  <div class="w-3/4">
    <h4 class="info" on:click={() => modal.show("statics")}>Statics 🗿</h4>
    <button class="btn add" on:click={() => statics.add($currentEmoji)}>
      [ {$currentEmoji == "" ? "____" : $currentEmoji} ]
    </button>
    {#each [...$statics] as item (item)}
      <div transition:scale|local={flipParams} animate:flip={flipParams}>
        <button class="btn remove" on:click={() => statics.remove(item)}
          >{item}</button
        >
      </div>
    {/each}
  </div>
</div>

<style>
  :root {
    --picked-color: black;
  }

  /* BUTTONS */

  /* .collision-btn {
    border-color: #3a96dd;
    background: #e9f3fb;
  }

  .collision-btn:hover {
    background: #3a96dd;
  }

  .condition-btn {
    border-color: #644292;
    background: #cfc0e3;
  }

  .condition-btn:hover {
    background: #644292;
  }

  .event-btn {
    border-color: #ffc83d;
    background: #fff3d6;
  }

  .event-btn:hover {
    background: #ffc83d;
  } */
</style>
