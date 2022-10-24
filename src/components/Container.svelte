<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { pushes, currentEmoji } from "../store";

  export let id: number;
  let slot = "";

  function updateSlot() {
    slot = $currentEmoji;
    if (slot == "") return;
  }

  // onDestroy(() => {
  //   if (slot == "") {
  //     pushes.remove(id);
  //   }
  // });
</script>

<div class="slot" on:click={updateSlot}>
  {slot}
</div>

<style>
  .slot {
    padding-top: 8px;
    border-radius: 4px;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    font-size: 16px;
  }
</style>
