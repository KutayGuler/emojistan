<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { merges, currentEmoji } from "../store";
  import { notifications } from "../routes/notifications";

  export let id: number;
  let slots = ["", "", ""];

  onMount(() => {
    slots = $merges.get(id) || ["", "", ""];
  });

  function checkCollision() {
    if (
      [...$merges].some(([_id, _slots]) => {
        if (id == _id) return false;
        let _firstTwo = [_slots[0], _slots[1]];
        let firstTwo = [slots[0], slots[1]];
        return (
          _firstTwo.toString() == firstTwo.toString() ||
          _firstTwo.reverse().toString() == firstTwo.toString()
        );
      })
    ) {
      slots = ["", "", ""];
      notifications.warning(
        "Merges are bidirectional and can only have one outcome"
      );
      return;
    }

    merges.update(id, slots);
  }

  function updateSlot(i: number) {
    slots[i] = $currentEmoji;
    if (slots.includes("")) return;
    if (slots[0] == slots[2] || slots[1] == slots[2]) {
      slots[2] = "";
      notifications.warning("Inputs cannot be the same with output");
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

<div class="slots">
  {#each { length: 3 } as _, i}
    <div class="slot" on:click={() => updateSlot(i)}>
      <div>{slots[i]}</div>
    </div>
  {/each}
</div>
