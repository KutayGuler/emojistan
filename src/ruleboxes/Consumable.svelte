<script lang="ts">
  import { notifications } from "$src/routes/notifications";
  import {
    consumables,
    currentEmoji,
    equippables,
    interactables,
  } from "$src/store";
  import { Consumable } from "$src/types";
  import { onDestroy, onMount } from "svelte";

  export let id: number;
  export let emoji = "";
  export let hp = 1;
  export let mutateConsumerTo = "";
  export let mutateConsumer = false;

  let modifierPoints: Array<number> = [];

  for (let i = 0; i < 100; i++) {
    modifierPoints[i] = i + 1;
  }

  for (let i = 0; i >= -100; i--) {
    modifierPoints.unshift(i);
  }

  modifierPoints = modifierPoints.filter((val) => val != 0);

  onMount(() => {
    let obj = $consumables.get(id);
    if (obj) {
      ({ emoji, hp, mutateConsumerTo } = obj);
    }
  });

  onDestroy(() => {
    if (emoji == "") {
      consumables.remove(id);
      return;
    }

    if (!mutateConsumer) {
      mutateConsumerTo = "";
      updateStore();
    }
  });

  function updateStore() {
    consumables.update(id, new Consumable(emoji, hp, mutateConsumerTo));
  }

  function updateEmoji() {
    for (let [_id, val] of $consumables.entries()) {
      if (_id == id) continue;

      if ($currentEmoji == val.emoji) {
        notifications.warning("Cannot have two consumables with same emoji");
        return;
      }
    }

    for (let val of [...$interactables.values(), ...$equippables.values()]) {
      if (
        (typeof val == "string" && val != "" && $currentEmoji == val) ||
        (typeof val == "object" && $currentEmoji == val.emoji)
      ) {
        notifications.warning(
          "An emoji can only have one assigned type. Interactable, Consumable or Equippable"
        );
        return;
      }
    }

    emoji = $currentEmoji;
    updateStore();
  }

  function updateMutationEmoji() {
    mutateConsumerTo = $currentEmoji;
  }
</script>

<div
  title="Mutate consumer"
  class:mutateConsumer
  class="absolute top-0.5 left-1 opacity-50 hover:cursor-pointer"
  on:click={() => (mutateConsumer = !mutateConsumer)}
>
  🧬
</div>
<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  <div class="flex flex-col items-center justify-center">
    <div class="slot-lg" on:click={updateEmoji}>
      {emoji}
    </div>
    {#if !mutateConsumer}
      <div class="absolute -bottom-4">
        <select
          class="select select-bordered select-sm text-xl"
          title="HP"
          bind:value={hp}
          on:change={updateStore}
        >
          {#each modifierPoints as point}
            <option value={point}>{point > 0 ? `+${point}` : point}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
  {#if mutateConsumer}
    <!-- content here -->
    <div class="flex flex-col items-center justify-center">
      <div class="slot-lg scale-75" on:click={updateMutationEmoji}>
        {mutateConsumerTo}
      </div>
    </div>
  {/if}
</div>

<style>
  .mutateConsumer {
    opacity: 1;
  }
</style>
