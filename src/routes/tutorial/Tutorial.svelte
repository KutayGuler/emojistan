<script lang="ts">
  import type { Rulebox as TRulebox } from "$lib/types/index";
  import Rulebox from "$lib/Rulebox.svelte";
  import Game from "$src/views/Game.svelte";

  export let header: string;
  export let subheader = "";
  export let description: string;
  export let rbx: TRulebox;
  export let props: any;
  export let gameProps: any;
  export let veilHeight = 0;
</script>

<div
  class="relative flex h-full w-full flex-row items-start justify-center gap-4"
>
  <div class="relative flex w-full flex-col items-center justify-center">
    <div class="w-full self-start p-4">
      {#if header}
        <span class="flex-inline flex items-center">
          <h1 class="text-4xl">{header}</h1>
          <h3 class="pl-2 text-xl">{subheader}</h3>
        </span>
      {/if}
      <p class="h-32 pt-2">
        {description}
      </p>
    </div>
    <div
      style="width: {rbx.width}px; height: {rbx.height}px;"
      class="pointer-events-none relative mt-12 mb-24 flex flex-col justify-center"
    >
      {#key props}
        <Rulebox {rbx} {props} />
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
    {#key gameProps}
      <Game {...gameProps} showObjective={false} />
    {/key}
  </div>
</div>

<style>
  h1,
  h3 {
    color: var(--header);
  }
</style>
