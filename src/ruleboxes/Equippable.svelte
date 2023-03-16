<script lang="ts">
  import { onMount } from "svelte";
  import { notifications } from "$src/routes/notifications";
  import {
    consumables,
    currentEmoji,
    equippables,
    interactables,
  } from "$src/store";
  import { Equippable } from "$src/types";

  export let id: number;
  export let emoji = "";
  let hp = 1;

  let hps: Array<number> = [];

  for (let i = 0; i < 100; i++) {
    hps[i] = i + 1;
  }

  onMount(() => {
    let obj = $equippables.get(id);
    if (obj) {
      ({ emoji, hp } = obj);
    }
  });

  function updateStore() {
    equippables.update(id, new Equippable(emoji, hp));
  }

  function updateEmoji() {
    for (let [_id, val] of $equippables.entries()) {
      if (_id == id) continue;

      if ($currentEmoji == val.emoji) {
        notifications.warning("Cannot have two consumables with same emoji");
        return;
      }
    }

    for (let val of [...$interactables.values(), ...$consumables.values()]) {
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
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
  <div class="flex flex-col items-center justify-center">
    <button class="slot-lg" on:click={updateEmoji}>
      <i class="twa twa-{emoji}"></i>
    </button>
    <div class="absolute -bottom-4">
      <select
        class="select select-bordered select-sm text-xl"
        title="HP"
        bind:value={hp}
        on:change={updateStore}
      >
        {#each hps as _hp}
          <option value={_hp}>{_hp}</option>
        {/each}
      </select>
    </div>
  </div>
</div>
