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

<Svelvet nodes={initialNodes} edges={initialEdges} background />

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
