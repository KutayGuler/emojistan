<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { pushes, currentEmoji } from "../store";
  import { notifications } from "../routes/notifications";
  import { nodesStore } from "$src/lib/stores/store";

  export let id: number;
  export let slots = ["", "", "push"];
  export let editable = true;

  onMount(() => {
    slots = $pushes.get(id) || slots;
  });

  function checkCollision() {
    for (let [_id, _slots] of $pushes.entries()) {
      if (id == _id) continue;
      if (_slots[0] == slots[0] && _slots[1] == slots[1]) {
        slots = ["", "", "push"];
        notifications.warning("Can't have duplicate pushes.");
        break;
      }
    }

    // @ts-expect-error
    pushes.update(id, slots);
  }

  function updateSlot(i: number) {
    slots[i] = $currentEmoji;
    if (!slots.includes("")) {
      checkCollision();
    }
  }

  onDestroy(() => {
    if (slots.includes("")) {
      pushes.remove(id);
      nodesStore.remove(id);
    }
  });
</script>

<div class="flex h-full flex-row items-center justify-center gap-2">
  <div class="slot" on:click={() => editable && updateSlot(0)}>
    {slots[0]}
  </div>
  <div>💨</div>
  <div class="slot" on:click={() => editable && updateSlot(1)}>
    {slots[1]}
  </div>
</div>
