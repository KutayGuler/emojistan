<!-- <script lang="ts">
  import Base from "./Base.svelte";
  import { weapons } from "../store";

  export let id: string;
  export let disabled = false;

  let slots: Array<string> = [];
  function updateSlot(i: number) {}
</script>

<Base
  
  on:remove={() => weapons.remove(id)}
  --border-color="#13a10e"
  --background="#89f485"
>
  <div class="slots">
    {#each { length: 3 } as _, i}
      <div class="slot" on:click={() => !disabled && updateSlot(i)}>
        <div>{slots[i]}</div>
      </div>
    {/each}
  </div>
</Base> -->
