<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy, onMount } from "svelte";
  import { collisions, currentEmoji } from "../../store";
  import Base from "./Base.svelte";

  export let id: string;
  export let rule: Array<string> = [];

  let slots = ["", ""];
  let error: SvelteComponent;

  onMount(() => {
    if (rule.length != 0) {
      let [x, y, z] = rule;
      slots = [x, y];
    }
  });

  function checkCollision() {
    if (
      [...$collisions].some(([k, v]) => v[0] == slots[0] && v[1] == slots[1])
    ) {
      slots = ["", ""];
      error.display("Can't have duplicate pushes.");
      return;
    }

    collisions.update(id, [...slots, "push"]);
  }

  function updateSlot(i: number) {
    slots[i] = $currentEmoji;
    if (slots.includes("")) return;
    checkCollision();
  }

  onDestroy(() => {
    if (slots.includes("")) {
      collisions.remove(id);
    }
  });
</script>

<Base
  on:remove={() => collisions.remove(id)}
  --border-color="#3a96dd"
  --background="#e9f3fb"
>
  <div class="slots">
    {#each { length: 2 } as _, i}
      <div class="slot" on:click={() => updateSlot(i)}>
        <div>{slots[i]}</div>
      </div>
    {/each}
  </div>
  <Error bind:this={error} />
</Base>

<style>
  .slots {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .slot {
    aspect-ratio: 1;
    width: 4vw;
    height: 4vw;
    background-color: var(--primary);
    border: 2px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
