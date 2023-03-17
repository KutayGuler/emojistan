<script lang="ts">
  import { notifications } from "$src/routes/notifications";
  import {
    consumables,
    formattedEmoji,
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

      if ($formattedEmoji == val.emoji) {
        notifications.warning("Cannot have two consumables with same emoji");
        return;
      }
    }

    for (let val of [...$interactables.values(), ...$equippables.values()]) {
      if (
        (typeof val == "string" && val != "" && $formattedEmoji == val) ||
        (typeof val == "object" && $formattedEmoji == val.emoji)
      ) {
        notifications.warning(
          "An emoji can only have one assigned type. Interactable, Consumable or Equippable"
        );
        return;
      }
    }

    emoji = $formattedEmoji;
    updateStore();
  }

  function updateMutationEmoji() {
    mutateConsumerTo = $formattedEmoji;
  }
</script>

<button
  title="Mutate consumer"
  class:mutateConsumer
  class="absolute bottom-0.5 left-1 opacity-50 hover:cursor-pointer"
  on:click={() => (mutateConsumer = !mutateConsumer)}
>
<i class="twa twa-dna"></i>
</button>
<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  <div class="flex flex-col items-center justify-center">
    <button class="slot-lg" on:click={updateEmoji}>
      <i class="twa twa-{emoji}"></i>
    </button>
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
      <button class="slot-lg scale-75" on:click={updateMutationEmoji}>
        <i class="twa twa-{mutateConsumerTo}"></i>
      </button>
    </div>
  {/if}
</div>

<style>
  .mutateConsumer {
    opacity: 1;
  }
</style>
