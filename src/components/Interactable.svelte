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

  const mutations: Array<keyof Mutations> = [
    "addToInventory",
    "changePlayerHealthBy",
    "changePlayerTo",
    "changeSelfTo",
  ];

  export let id: number;

  let emoji = "";
  let mutation = mutations[0];
  let health = 1;
  let points = 0;
  let modifiers: Array<[string, number]> = [];

  onMount(() => {
    let obj = $interactables.get(id);
    console.log(obj);
    if (!obj) return;
    ({ emoji, mutation, health, points, modifiers } = obj);
    console.log(modifiers);
  });

  function update() {
    interactables.update(
      id,
      new Interactable(emoji, mutation, health, points, modifiers)
    );
  }

  onDestroy(() => {});

  function updateModifierKey(index: number) {
    if (index == 0) return;
    modifiers[index] = [$currentEmoji, points];
  }

  // TODO: Document component couplings step by step
</script>

<div class="flex flex-col">
  <div class="slot" on:click={() => (emoji = $currentEmoji)}>
    {emoji}
  </div>
  <b>on interaction</b>
  <select class="select" bind:value={mutation} on:change={update}>
    {#each mutations as m}
      <option value={m} />
    {/each}
  </select>
  <b>modifiers</b>
  {#each modifiers as [key, value], i}
    <div class="slot" on:click={() => updateModifierKey(i)}>
      {key}
    </div>
    <select class="select" bind:value on:change={update}>
      {#each [0, 1, 2, 3, 4, 5, 6, 7] as point}
        <option value={point} />
      {/each}
    </select>
  {/each}
</div>
