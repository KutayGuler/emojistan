<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy, onMount } from "svelte";
  import { merges, currentEmoji } from "../store";
  import Base from "./Base.svelte";

  export let id: number;
  export let rule: Array<string> = [];
  export let disabled = false;

  let slots = ["", "", ""];
  let error: SvelteComponent;

  onMount(() => {
    if (rule.length != 0) {
      slots = rule;
    }
  });

  function checkCollision() {
    if (
      [...$merges].some(([_id, _]) => {
        let _rule = _.rule;
        if (id == _id) return false;
        let _firstTwo = [_rule[0], _rule[1]];
        let firstTwo = [slots[0], slots[1]];
        return (
          slots.toString() == rule.toString() ||
          _firstTwo.toString() == firstTwo.toString() ||
          _firstTwo.reverse().toString() == firstTwo.toString()
        );
      })
    ) {
      slots = ["", "", ""];
      error.display("Merges are bidirectional and can only have one outcome");
      return;
    }

    // @ts-expect-error
    merges.updateValue(id, "rule", slots);
  }

  function updateSlot(i: number) {
    slots[i] = $currentEmoji;
    if (slots.includes("")) return;
    if (slots[0] == slots[2] || slots[1] == slots[2]) {
      slots[2] = "";
      error.display("Inputs cannot be the same with output");
      return;
    }

    checkCollision();
  }

  onDestroy(() => {
    if (slots.includes("")) {
      merges.remove(id);
    }
  });
</script>

<Base
  on:remove={() => merges.remove(id)}
  --border-color="#3a96dd"
  --background="#e9f3fb"
>
  <div class="slots">
    {#each { length: 3 } as _, i}
      <div class="slot" on:click={() => !disabled && updateSlot(i)}>
        <div>{slots[i]}</div>
      </div>
    {/each}
  </div>
  <Error bind:this={error} />
</Base>
