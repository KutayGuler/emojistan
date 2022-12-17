<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { merges, pushes, currentEmoji } from "../store";
  import { notifications } from "../routes/notifications";
  import { svelvetStore } from "$src/lib/stores/store";
  const { nodesStore } = svelvetStore;

  export let id: number;
  let slots = ["", "", ""];

  onMount(() => {
    slots = $merges.get(id) || ["", "", ""];
  });

  function checkCollision() {
    for (let [_id, _slots] of $pushes.entries()) {
      if (_slots[0] == slots[0] && _slots[1] == slots[1]) {
        slots = ["", "", ""];
        notifications.warning("Cannot have conflicting behaviours.");
        break;
      }
    }

    for (let [_id, _slots] of $merges.entries()) {
      console.log(id, _id);

      if (id == _id) continue;
      let _firstTwo = [_slots[0], _slots[1]];
      let firstTwo = [slots[0], slots[1]];
      if (
        _firstTwo.toString() == firstTwo.toString() ||
        _firstTwo.reverse().toString() == firstTwo.toString()
      ) {
        slots = ["", "", ""];
        notifications.warning(
          "Merges are bidirectional and can only have one outcome"
        );
        break;
      }
    }

    merges.update(id, slots);
  }

  function updateSlot(i: number) {
    slots[i] = $currentEmoji;
    if (slots.includes("")) return;
    if (slots[0] == slots[2] || slots[1] == slots[2]) {
      slots = ["", "", ""];
      notifications.warning("Inputs cannot be the same with output");
      return;
    }

    checkCollision();
  }

  onDestroy(() => {
    if (slots.includes("")) {
      merges.remove(id);
      nodesStore.remove(id);
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
