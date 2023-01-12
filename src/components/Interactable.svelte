<script lang="ts">
  // interactables = {
  // "emoji": {interactable}
  // }

  // example TREE
  // emoji: 🌲
  // onInteract: addToInventory {🍁} x {5}
  // health: 100
  // modifiers: anything: 0 | {🪓}: {-1}

  // example DOOR
  // emoji: 🚪
  // onInteract: ""
  // health: 1
  // modifiers: anything: 0 | {🔑}: {-1}

  // example KEY
  // emoji: 🔑
  // onInteract: addToInventory {🔑} x {1}
  // health: 1
  // modifiers: anything: -1

  // example FOOD
  // emoji: 🍔
  // onInteract: changePlayerHealth {20}
  // health: 1
  // modifiers: anything: -1

  // example POISONOUS MUSHROOM
  // emoji: 🍄
  // onInteract: changePlayerHealth {-20}
  // health: 1
  // modifiers: anything: -1

  // example MONEY
  // emoji: 💵
  // onInteract: changePlayerTo {🤑}
  // health: 1
  // modifiers: anything: -1
  // TODO:

  // example COOKING

  import { edgesStore, nodesStore } from "$src/lib/stores/store";
  import { onDestroy, onMount } from "svelte";
  import { notifications } from "../routes/notifications";
  import {
    currentEmoji,
    Interactable,
    interactables,
    type Mutations,
  } from "../store";

  // emoji: the thing itself
  // onInteract: addToInventory {emoji} | changePlayerHealth {points} | changePlayerTo {emoji} | changeSelfTo {emoji}
  // health: 1
  // modifiers: anything: 0 | {emoji}: {points}

  const actions: Array<keyof Mutations | "none"> = [
    "none",
    "addToInventory",
    "changePlayerHealthBy",
    "changePlayerTo",
  ];

  export let id: number;

  let emoji = "";
  let action = actions[0];
  let actionEmoji = "";
  let health = 1;
  let points = 0;
  let modifiers: Array<[string, number]> = [];

  onMount(() => {
    let obj = $interactables.get(id);
    console.log(obj);
    if (!obj) return;
    ({ emoji, action, actionEmoji, health, points, modifiers } = obj);
    console.log(modifiers);
  });

  function update() {
    interactables.update(
      id,
      new Interactable(emoji, action, actionEmoji, health, points, modifiers)
    );
  }

  onDestroy(() => {
    if (emoji == "") {
      interactables.remove(id);
      nodesStore.remove(id);
      edgesStore.filter(id);
      return;
    }

    console.log(modifiers);

    modifiers = modifiers.filter((m) => m[0] != "");
    modifiers = modifiers.filter((m, i) => {
      if (i == 0) return true;
      return m[1] != 0;
    });
    console.log(modifiers);

    update();
    // interactables.update(
    //   id,
    //   new Interactable(emoji, action, actionEmoji, health, points, modifiers)
    // );
  });

  function updateModifierKey(index: number) {
    if (index == 0) return;
    modifiers[index] = [$currentEmoji, points];
  }

  function deleteModifier(index: number) {
    modifiers.splice(index, 1);
    modifiers = modifiers;
  }

  // TODO: Document component couplings step by step
</script>

<div class="form-control flex flex-col">
  <div class="slot" on:click={() => (emoji = $currentEmoji)}>
    {emoji}
  </div>
  <div class="form-control flex flex-row items-center justify-start gap-2">
    <!-- <b>interaction: </b> -->
    <label class="label">
      <span class="label-text">action</span>
    </label>
    <select class="select" bind:value={action} on:change={update}>
      {#each actions as m}
        <option value={m}>{m}</option>
      {/each}
    </select>
  </div>
  {#if action == "changePlayerHealthBy"}
    <select bind:value={points}>
      {#each [1, 2, 3, 4] as item}
        <option value={item}>{item}</option>
      {/each}
    </select>
  {:else}
    <div class="slot" on:click={() => (actionEmoji = $currentEmoji)}>
      {actionEmoji}
    </div>
  {/if}
  <div class="flex flex-row items-center justify-start gap-2">
    <b>health: </b>
    <select class="select" bind:value={health} on:change={update}>
      {#each [1, 2, 3, 4, 5, 6] as h}
        <option value={h}>{h}</option>
      {/each}
    </select>
  </div>
  <b>health modifiers</b>
  {#each modifiers as [key, value], i}
    <div class="flex flex-row items-center justify-start gap-2">
      <div class="slot" on:click={() => updateModifierKey(i)}>
        {key}
      </div>
      <select class="select" bind:value on:change={update}>
        {#each [-1, -2, -3, -4, 0, 1, 2, 3, 4] as point}
          <option value={point}>{point}</option>
        {/each}
      </select>
      {#if i != 0}
        <button class="btn" on:click={() => deleteModifier(i)}>🞪</button>
      {/if}
    </div>
  {/each}
  <button
    class="btn"
    on:click={() => {
      modifiers = [...modifiers, ["", 1]];
    }}>Add modifier</button
  >
</div>
