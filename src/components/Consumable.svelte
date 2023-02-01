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
  let emoji = "";
  let hp = 1;
  let mutateConsumerTo = "";

  let mutateConsumer = false;

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
    console.log($consumables);
  }

  function updateEmoji() {
    console.log("update emoji");

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

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  <div class="slot-lg" on:click={updateEmoji}>
    {emoji}
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
<main class="flex flex-col items-center justify-center gap-12 pt-16">
  <div class="form-control">
    <!-- <span class="label-text">Add to Consumer HP</span>
      <div class="slot">{addToConsumerHP}</div> -->
    <label class="label">
      <span class="label-text">Add to consumer HP</span>
    </label>
    <select
      class="select select-bordered select-sm text-xl"
      title="HP"
      bind:value={hp}
      on:change={updateStore}
    >
      {#each modifierPoints as point}
        <option value={point}>{point}</option>
      {/each}
    </select>
    <label class="label cursor-pointer">
      <span class="label-text">Mutate Consumer</span>
      <input type="checkbox" class="checkbox" bind:checked={mutateConsumer} />
    </label>
  </div>
</main>
