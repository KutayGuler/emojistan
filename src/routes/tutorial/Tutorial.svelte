<script lang="ts">
  import type { Node as TNode } from "$lib/types/index";
  import Node from "$lib/Nodes/index.svelte";
  import Game from "$src/views/Game.svelte";
  import { onMount } from "svelte";

  export let header: string;
  export let subheader = "";
  export let description: string;
  export let node: TNode;
  export let props: any;
  export let gameProps: any;
  export let veilHeight = 0;

  $: console.log(props);
</script>

<div
  class="relative flex h-full w-full flex-row items-start justify-center gap-4"
>
  <div class="relative flex w-full flex-col items-center justify-center">
    <div class="self-start p-4">
      {#if header}
        <span class="flex-inline flex items-center">
          <h1 class="text-4xl">{header}</h1>
          <h3 class="pl-2 text-xl">{subheader}</h3>
        </span>
      {/if}
      <p class="h-24 pt-2">
        {description}
      </p>
    </div>
    <div
      style="width: {node.width}px; height: {node.height}px;"
      class="pointer-events-none relative mt-12 mb-24 flex flex-col justify-center"
    >
      {#key props}
        <Node {node} {props} />
      {/key}
      <div
        style:height={veilHeight + "px"}
        class="absolute bottom-0 z-10 w-full bg-indigo-50"
      />
    </div>
  </div>
  <div
    class="relative flex w-full flex-col items-center justify-center self-center"
  >
    <Game {...gameProps} showObjective={false} />
  </div>
</div>

<style>
  h1,
  h3 {
    color: var(--header);
  }
</style>
