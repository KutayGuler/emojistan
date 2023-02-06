<script lang="ts">
  import type { Node as TNode } from "$lib/types/index";
  import Node from "$lib/Nodes/index.svelte";
  import Game from "$src/views/Game.svelte";

  export let header: string;
  export let description: string;
  export let component: any;
  export let node: TNode;
  export let props: any;
  export let gameProps: any;
</script>

<div class="self-start p-4">
  <h1 class="text-4xl">{header}</h1>
  <p class="pt-2">
    {description}
  </p>
</div>
<div
  style="height: {node.height}px; width: {node.width}px;"
  class="pointer-events-none absolute z-10 mt-44"
>
  <Node {node}>
    <svelte:component this={component} {...props} />
  </Node>
</div>
<div class="absolute flex h-full items-center">
  <Game {...gameProps} />
</div>

<style>
  h1 {
    color: var(--header);
  }
</style>
