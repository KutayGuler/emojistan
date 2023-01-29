<script lang="ts">
  import { scale } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onDestroy, onMount } from "svelte/internal";
  import { currentColor, currentEmoji } from "../store";
  import { DEFAULT_MAP_CLASS, DEFAULT_SIDE_LENGTH } from "$src/constants";
  import {
    Interactable,
    Item,
    type ArrowKey,
    type CollisionType,
    type EditableMap,
    type Mutations,
    type Wasd,
    type _Collisions,
    type _Interactable,
    type _Interactables,
  } from "$src/types";

  /* ## DATA ## */
  export let map: EditableMap;
  export let pushes = new Map<number, [string, string, CollisionType]>();
  export let merges = new Map<number, [string, string, CollisionType]>();
  export let interactables = new Map<number, Interactable>();
  export let statics = new Set<string>();
  export let mapClass = DEFAULT_MAP_CLASS;
  export let SIZE = DEFAULT_SIDE_LENGTH;

  console.log(mapClass);

  /* ## STATE ## */
  let dialog: HTMLDialogElement;
  let levelCompleted = false;
  let ac = -2; // ACTIVE CELL
  let ic: number; // INTERACTED CELL
  let directionKey: Wasd = "KeyD";
  let currentInventoryIndex = 0;
  let items = new Map<number, Item>();
  let backgrounds = new Map(map.backgrounds);
  let _interactables: _Interactables = {};
  let timeouts: Array<NodeJS.Timeout> = [];
  let intervals: Array<NodeJS.Timer> = [];

  onMount(() => {
    [$currentColor, $currentEmoji] = ["", ""];
  });

  onDestroy(() => {
    for (let timer of timeouts) {
      clearTimeout(timer);
    }

    for (let interval of intervals) {
      clearInterval(interval);
    }
  });

  const KEYS: {
    [key in Wasd]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -SIZE },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: SIZE },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };

  const WASD = ["KeyW", "KeyA", "KeyS", "KeyD"];

  const wasdToArrow: { [key in Wasd]: ArrowKey } = {
    KeyW: "ArrowUp",
    KeyA: "ArrowLeft",
    KeyD: "ArrowRight",
    KeyS: "ArrowDown",
  };

  function calcOperation(code: ArrowKey, index: number) {
    if (code == "ArrowLeft" && index % SIZE == 0) return 0;
    if (code == "ArrowUp" && index < SIZE) return 0;
    if (code == "ArrowRight" && (index + 1) % SIZE == 0) return 0;
    if (code == "ArrowDown" && index >= SIZE * SIZE - SIZE) return 0;
    return (
      (["ArrowUp", "ArrowDown"].includes(code) ? SIZE : 1) *
      (["ArrowRight", "ArrowDown"].includes(code) ? 1 : -1)
    );
  }

  /**
   * function mutates ac if it is equal to "from" parameter
   * Transfers an item from "from" to "to"
   */
  function transferItem(from: number, to: number) {
    // @ts-expect-error
    items.set(to, items.get(from));
    items.delete(from);
    items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

    if (ac == from) {
      ac = to;
      ic = ac + KEYS[directionKey].operation;
    }
  }

  /**
   * function mutates ac if it is equal to "from" parameter
   * Transfers an item from "from" to "to" and applies mergeResult
   */
  function transferAndMerge(from: number, to: number, mergeResult: string) {
    let fromInventory = items.get(from)?.inventory || [];
    let fromHP = items.get(from)?.hp.current || 1;
    let toInventory = items.get(to)?.inventory || [];
    let mergedInventory = [...fromInventory, ...toInventory];
    while (mergedInventory.length > 4) {
      mergedInventory.pop();
    }

    items.set(
      to,
      new Item(
        mergeResult,
        mergedInventory,
        _interactables[mergeResult]?.hp || fromHP
      )
    );
    items.delete(from);
    items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

    if (ac == from) {
      ac = to;
      ic = ac + KEYS[directionKey].operation;
    }
  }

  for (let [id, interactable] of interactables) {
    const { emoji, ...args } = interactable;
    // @ts-expect-error
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
  }

  function initItems() {
    for (let [id, item] of map.items) {
      items.set(id, new Item(item));
    }

    for (let [index, { emoji, hp }] of items) {
      if (ac == -2 && !statics.has(emoji)) {
        ac = index;
        ic = ac + 1;
      }

      hp.max = _interactables[emoji]?.hp || 1;
      hp.current = _interactables[emoji]?.hp || 1;
    }
  }

  initItems();
  let player = items.get(ac);
  $: player = items.get(ac);

  let progress = tweened(player?.hp.current || 1, {
    duration: 400,
    easing: cubicOut,
  });

  let numbers = new Map<number, number>();

  for (let i = 0; i <= 100; i++) {
    numbers.set(i, i / 100);
  }

  function calcPlayerHpPercentage(): number {
    // @ts-expect-error
    let { hp } = player;
    if (!hp) return 0;
    if (hp.current > hp.max) return 1;
    return numbers.get(Math.floor((hp.current * 100) / hp.max)) || 0;
  }

  let _collisions: _Collisions = {};

  for (let [id, _slots] of [...merges, ...pushes]) {
    let [key1, key2, val] = _slots;
    if (key1 == "") continue;
    if (!_collisions[key1]) {
      _collisions[key1] = {};
    }

    _collisions[key1][key2] = val;

    // making emoji merge both ways
    if (val != "push" && key1 != key2) {
      if (!_collisions[key2]) {
        _collisions[key2] = {};
      }

      _collisions[key2][key1] = val;
    }
  }

  // MUTATIONS
  const m: Mutations = {
    setBackgroundOf({ index, background }) {
      backgrounds.set(index, background);
      backgrounds = backgrounds;
    },
    removeBackgroundOf({ index }) {
      backgrounds.delete(index);
    },
    spawn({ index, emoji }) {
      items.set(index, new Item(emoji));
      items = items;
    },
    destroy({ index }) {
      items.delete(index);
    },
    wait: async (duration) => {
      return new Promise((resolve) => {
        let timer = setTimeout(resolve, duration);
        timeouts.push(timer);
      });
    },
    changePlayerTo({ emoji }) {
      // @ts-expect-error
      player.emoji = emoji;
    },
    addToPlayerInventory({ emoji }) {
      if (emoji && player?.inventory.length != 4) {
        // @ts-expect-error
        player?.inventory.push(emoji);
        items = items;
      }
    },
    teleportPlayerTo({ index }) {
      transferItem(ac, index);
      items = items;
    },
    resetLevel: () => {
      backgrounds = new Map(map.backgrounds);
      initItems();
      ac = items.entries().next().value[0];
      ic = ac + 1;
      directionKey = "KeyD";
      levelCompleted = false;
    },
    completeLevel: () => (levelCompleted = true),
    addToPlayerHP: ({ points }) => {
      if (!player) return;
      player.hp.add(points);
      progress.set(calcPlayerHpPercentage());
    },
  };

  function getCollisionType(key1: string, key2: string): CollisionType {
    if (!_collisions[key1]) return "bump";
    return _collisions[key1][key2] || "bump";
  }

  function enactPushCollision(operation: number) {
    let collisionChain = [];
    let i = 0;

    while (items.has(ac + operation * i)) {
      console.log(ac + operation * i);
      collisionChain.push(items.get(ac + operation * i)?.emoji);
      i++;
    }

    console.log(collisionChain);

    let collisionTypeSequence: Array<CollisionType> = [];
    for (let i = 0; i < collisionChain.length - 1; i++) {
      collisionTypeSequence.push(
        // @ts-expect-error
        getCollisionType(collisionChain[i], collisionChain[i + 1])
      );
    }

    let finalIndex = ac + operation * (i - 1);
    let code = "";

    switch (operation) {
      case 1:
        code = "ArrowRight";
        break;
      case -1:
        code = "ArrowLeft";
        break;
      case SIZE:
        code = "ArrowDown";
        break;
      case -SIZE:
        code = "ArrowUp";
        break;
    }

    // @ts-expect-error
    if (calcOperation(code, finalIndex) == 0) return;

    if (collisionTypeSequence.every((str) => str == "push")) {
      let length = collisionChain.length;
      collisionChain.reverse();

      for (let i = length - 1; i >= 0; i--) {
        let from = ac + i * operation;
        let to = ac + (i + 1) * operation;
        transferItem(from, to);
      }
    } else {
      collisionTypeSequence = collisionTypeSequence.slice(
        0,
        collisionTypeSequence.findIndex((str) => str == "bump")
      );

      if (
        collisionTypeSequence.length == 0 ||
        collisionTypeSequence.at(-1) == "push"
      )
        return;

      for (let i = collisionTypeSequence.length - 1; i >= 0; i--) {
        let from = ac + i * operation;
        let to = ac + (i + 1) * operation;

        if (collisionTypeSequence[i] != "push") {
          transferAndMerge(from, to, collisionTypeSequence[i]);
        } else {
          transferItem(from, to);
        }
      }
    }
  }

  async function handle(e: KeyboardEvent) {
    e.preventDefault();
    if (!items.has(ac) || (player?.hp || -1) <= 0) return;

    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code as ArrowKey, ac);
      if (!player || statics.has(player.emoji) || operation == 0) return;
      let facingItem = items.get(ac + operation);

      if (!facingItem) {
        transferItem(ac, ac + operation);
        return;
      }

      let collisionType = getCollisionType(player.emoji, facingItem.emoji);

      switch (collisionType) {
        case "push":
          enactPushCollision(operation);
          break;
        case "bump":
          break;
        default:
          transferAndMerge(ac, ac + operation, collisionType);
          break;
      }
      return;
    }

    if (e.code.includes("Digit")) {
      let digit = +e.code.replace("Digit", "");
      currentInventoryIndex =
        digit - 1 == currentInventoryIndex ? -1 : digit - 1;
      return;
    }

    if (WASD.includes(e.code)) {
      directionKey = e.code as Wasd;
      ic = ac + KEYS[directionKey].operation;
      return;
    }

    if (e.code == "Space") {
      if (calcOperation(wasdToArrow[directionKey], ic) == 0) return;
      let interactedItem = items.get(ic);
      if (interactedItem == undefined) return;
      let interactable: _Interactable = _interactables[interactedItem.emoji];
      if (interactable == undefined || interactable.executing) return;
      let { sequence, modifiers, evolve, devolve } = interactable;

      for (let { type, ...args } of sequence) {
        if (type == "addToPlayerInventory") {
          if (player?.inventory.length == 4) {
            return;
          }
        }
      }

      _interactables[interactedItem.emoji].executing = true;
      let equippedItem =
        (player?.inventory || [])[currentInventoryIndex] || "any";

      let modifier =
        modifiers.find((m) => m[0] == equippedItem) || modifiers[0];

      if (modifier[1] == 0) return;
      interactedItem.hp.current += modifier[1];

      for (let { type, ...args } of sequence) {
        if (type == "wait") {
          await m.wait(args.duration);
        } else {
          m[type](args);
        }
      }

      let playerEvolve = _interactables[player?.emoji || ""]?.evolve;
      let playerDevolve = _interactables[player?.emoji || ""]?.devolve;

      // EVOLVE & DEVOLVE PLAYER
      if (player && player?.hp.current <= 0) {
        if (playerDevolve?.enabled && playerDevolve.to != "") {
          player.emoji = playerDevolve.to;
        } else {
          items.delete(ac);
        }
      } else if (
        playerEvolve?.enabled &&
        playerEvolve.at == player?.hp.current
      ) {
        player.emoji = playerEvolve.to;
      }

      // EVOLVE & DEVOLVE INTERACTED ITEM
      if (interactedItem.hp.current <= 0) {
        if (devolve?.enabled && devolve.to != "") {
          interactedItem.emoji = devolve.to;
        } else {
          items.delete(ic);
        }
      } else if (evolve?.enabled && evolve.at == interactedItem.hp.current) {
        interactedItem.emoji = evolve.to;
      }

      items = items;
      _interactables[interactedItem.emoji].executing = false;
      return;
    }

    if (e.code.includes("Control")) {
      if (
        calcOperation(wasdToArrow[directionKey], ic) == 0 ||
        !player?.inventory ||
        items.has(ic)
      ) {
        return;
      }
      items.set(ic, new Item(player?.inventory[currentInventoryIndex]));
      player.inventory.splice(currentInventoryIndex, 1);
      items = items;
      console.log(items);

      return;
    }

    let closestDistance = 300;
    let closestID = ac;

    let _items = Array.from(items).filter(
      ([id, { emoji }]) => !statics.has(emoji)
    );

    if (e.code == "KeyE") {
      for (let [id, _] of _items) {
        if (id == ac) continue;
        if (id > ac && id - ac < closestDistance) {
          closestDistance = id - ac;
          closestID = id;
        }
      }

      if (closestDistance == 300) {
        let smallest = 300;
        for (let [id, _] of _items) {
          if (id < smallest) smallest = id;
        }
        ac = smallest;
        ic = ac + KEYS[directionKey].operation;
      } else {
        ac = closestID;
        ic = ac + KEYS[directionKey].operation;
      }

      progress = tweened(calcPlayerHpPercentage(), {
        duration: 400,
        easing: cubicOut,
      });
      return;
    }

    if (e.code == "KeyQ") {
      for (let [id, _] of _items) {
        if (id == ac) continue;
        if (ac > id && ac - id < closestDistance) {
          closestDistance = ac - id;
          closestID = id;
        }
      }

      if (closestDistance == 300) {
        let biggest = 0;
        for (let [id, _] of _items) {
          if (id > biggest) biggest = id;
        }
        ac = biggest;
        ic = ac + KEYS[directionKey].operation;
      } else {
        ac = closestID;
        ic = ac + KEYS[directionKey].operation;
      }

      progress = tweened(calcPlayerHpPercentage(), {
        duration: 400,
        easing: cubicOut,
      });
      return;
    }
  }
</script>

<svelte:window on:keydown={handle} />

<div class={mapClass}>
  {#each { length: SIZE * SIZE } as _, i}
    {@const active = ac == i}
    <div style:background={backgrounds.get(i) || map.dbg} class:active>
      {#if active}
        <div class="direction scale-75" style={KEYS[directionKey].style}>
          {(player?.inventory || [])[currentInventoryIndex] ||
            KEYS[directionKey].emoji}
        </div>
      {/if}
      {items.get(i)?.emoji || ""}
    </div>
  {/each}
  {#if levelCompleted}
    <dialog open bind:this={dialog} transition:scale>
      LEVEL COMPLETED!
      <button on:click={() => (levelCompleted = !levelCompleted)}>OK</button>
      <button on:click={() => m.resetLevel()}>REPLAY</button>
    </dialog>
  {/if}
</div>

{#if mapClass == DEFAULT_MAP_CLASS}
  {#key ac}
    <div
      class="absolute -top-16 flex w-64 flex-row items-center justify-center gap-2"
    >
      <p class="absolute -left-4 z-10 self-start">{player?.emoji}</p>
      <progress class="progress progress-success h-8" value={$progress} />
      <p class="absolute">{$progress.toFixed(2)}</p>

      <!-- HP -->
    </div>
    <div
      class="absolute -bottom-20 flex w-full flex-row items-center justify-center gap-2"
    >
      {#each { length: 4 } as _, i}
        <div
          class:selected={i == currentInventoryIndex}
          class="flex h-12 w-12 flex-col items-center justify-center bg-base-300 p-2"
        >
          {(player?.inventory || [])[i] || ""}
        </div>
      {/each}
    </div>
  {/key}
{/if}

<style>
  .selected {
    scale: 120%;
    border: 2px solid black;
  }
</style>
