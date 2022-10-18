<script lang="ts">
  import Error from "./Error.svelte";
  import type { SvelteComponent } from "svelte";
  import { onDestroy, onMount } from "svelte";
  import { pushes, currentEmoji } from "../store";
  import Base from "./Base.svelte";

  export let id: string;
  export let rule: Array<string> = [];
  export let disabled = false;

  let slot = "";
  let error: SvelteComponent;

  // onMount(() => {
  //   if (rule.length != 0) {
  //     let [x, y, z] = rule;
  //     slots = [x, y];
  //   }
  // });

  function checkCollision() {
    // if (
    //   [...$pushes].some(
    //     ([k, { rule }]) => rule[0] == slots[0] && rule[1] == slots[1]
    //   )
    // ) {
    //   slot = ""
    //   error.display("Can't have duplicate pushes.");
    //   return;
    // }
    // @ts-expect-error
    // pushes.updateValue(id, "rule", [...slots, "push"]);
  }

  function updateSlot() {
    slot = $currentEmoji;
    if (slot == "") return;
    checkCollision();
  }

  onDestroy(() => {
    if (slot == "") {
      pushes.remove(id);
    }
  });
</script>

<div class="slots">
  <div class="slot" on:click={() => !disabled && updateSlot()}>
    {slot}
  </div>
</div>
