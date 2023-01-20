<script lang="ts">
  import { scale } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onDestroy, onMount } from "svelte/internal";
  import {
    map,
    pushes,
    merges,
    currentColor,
    currentEmoji,
    statics,
    interactables,
    type Mutations,
    type SequenceItem,
    type Evolve,
    Devolve,
  } from "../store";
  import { SIZE } from "$src/constants";
  import type { CollisionType } from "$src/types";

  interface _Collisions {
    [key1: string]: {
      [key2: string]: CollisionType;
    };
  }

  // TODO: JSDoc this function mutates ac if it is equal to "from" parameter
  function transferItem(from: number, to: number) {
    items.set(to, items.get(from));
    items.delete(from);
    items = items;
    if (ac == from) {
      ac = to;
      ic = ac + dirs[dirKey].operation;
    }
  }

  interface HP {
    current: number;
    max: number;
    add(points: number): void;
  }

  class HP {
    constructor(points: number) {
      this.current = points;
      this.max = points;
    }

    add(points: number) {
      this.current += points;
      if (this.current > this.max) {
        this.max = this.current;
      }
    }
  }

  interface Item {
    emoji: string;
    inventory: [string, string, string, string] | [];
    hp: HP;
  }

  class Item {
    constructor(emoji: string) {
      this.emoji = emoji;
      this.inventory = [];
      this.hp = new HP(0);
    }
  }

  interface _Interactable {
    executing: boolean;
    sequence: Array<SequenceItem>;
    points: number;
    hp: number;
    modifiers: Array<[string, number]>;
    evolve: Evolve;
    devolve: Devolve;
  }

  interface _Interactables {
    [key: string]: _Interactable;
  }

  onMount(() => {
    [$currentColor, $currentEmoji] = ["", ""];
  });

  type Wasd = "KeyW" | "KeyA" | "KeyS" | "KeyD";
  type ArrowKey = "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown";

  let wasdToArrow: { [key in Wasd]: ArrowKey } = {
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

  /* ## STATE ## */
  let dialog: HTMLDialogElement;

  let timeouts: Array<NodeJS.Timeout> = [];
  let intervals: Array<NodeJS.Timer> = [];

  onDestroy(() => {
    for (let timer of timeouts) {
      clearTimeout(timer);
    }

    for (let interval of intervals) {
      clearInterval(interval);
    }
  });

  let playerFrozen = false;
  let levelCompleted = false;
  let ac = -2; // ACTIVE CELL
  let ic: number; // INTERACTED CELL
  let dirs: {
    [key in Wasd]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -SIZE },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: SIZE },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };
  let dirKey: Wasd = "KeyD";
  let currentInventoryIndex = 0;

  /* ## DATA ## */
  let _map = structuredClone($map);
  let items = new Map<number, Item>();
  let backgrounds = new Map(_map.backgrounds);
  let _interactables: _Interactables = {};

  for (let [id, interactable] of $interactables) {
    const { emoji, ...args } = interactable;
    // @ts-expect-error
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
  }

  function initItems() {
    for (let [id, item] of _map.items) {
      items.set(id, new Item(item));
    }

    for (let [index, { emoji, hp }] of items) {
      if (ac == -2 && !$statics.has(emoji)) {
        ac = index;
        ic = ac + 1;
      }

      hp.max = _interactables[emoji]?.hp || 0;
      hp.current = _interactables[emoji]?.hp || 0;
    }
  }

  initItems();
  console.log(items, ac);
  $: player = items.get(ac);
  console.log(player); // TODO: why is it undefined?

  let progress = tweened(player?.hp.current || 0, {
    duration: 400,
    easing: cubicOut,
  });

  let numbers = new Map<number, number>();

  for (let i = 0; i <= 100; i++) {
    numbers.set(i, i / 100);
  }

  function getHPpercentage(): number {
    let { hp } = player;
    if (!hp) return 0;
    if (hp.current > hp.max) return 1;
    return numbers.get(Math.floor((hp.current * 100) / hp.max)) || 0;
  }

  let _collisions: _Collisions = {};

  for (let [id, _slots] of [...$merges, ...$pushes]) {
    let [key1, key2, val] = _slots;
    if (!_collisions[key1]) {
      _collisions[key1] = {};
    }

    _collisions[key1][key2] = val;

    // making emoji merge both ways
    if (val != "push") {
      if (key1 != key2) {
        if (!_collisions[key2]) {
          _collisions[key2] = {};
        }

        _collisions[key2][key1] = val;
      }
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
        player?.inventory.push(emoji);
        items = items;
      }
    },
    teleportPlayerTo({ index }) {
      transferItem(ac, index);
      items = items;
    },
    freezePlayer: () => (playerFrozen = true),
    unfreezePlayer: () => (playerFrozen = false),
    resetLevel: () => {
      backgrounds = new Map(_map.backgrounds);
      initItems();
      ac = items.entries().next().value[0];
      ic = ac + 1;
      dirKey = "KeyD";
      levelCompleted = false;
    },
    completeLevel: () => (levelCompleted = true),
    addToPlayerHP: ({ points }) => {
      if (!player) return;
      player.hp.add(points);
      progress.set(getHPpercentage());
    },
  };

  function getCollisionType(key1: string, key2: string): CollisionType {
    if (!_collisions[key1]) return "bump";
    return _collisions[key1][key2] || "bump";
  }

  // TODO: merge inventories
  // TODO: set HP according to emoji's max (default) HP

  function enactPushCollision(operation: number) {
    let collisionChain = [];
    let i = 0;

    while (items.has(ac + operation * i)) {
      collisionChain.push(items.get(ac + operation * i)?.emoji || "");
      i++;
    }

    let arr: Array<CollisionType> = [];
    for (let i = 0; i < collisionChain.length - 1; i++) {
      arr.push(getCollisionType(collisionChain[i], collisionChain[i + 1]));
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

    if (arr.every((str) => str == "push")) {
      while (collisionChain.length != 0) {
        let emoji = collisionChain.pop();
        if (emoji) {
          items.set(ac + operation * i--, new Item(emoji));
          items = items;
        }
      }

      transferItem(ac, ac + operation);
    } else if (arr.some((str) => [undefined, "push", "bump"].includes(str))) {
      arr = arr.slice(
        0,
        arr.findIndex((str) => [undefined, "push", "bump"].includes(str)) + 1
      );

      for (let i = 0; i < arr.length + 1; i++) {
        let current = collisionChain[i];
        let next = collisionChain[i + 1];

        if (!(next && current)) continue;

        let emoji = _collisions[current][next];
        if (emoji && emoji != "push") {
          // TODO: check if it works properly
          // TODO: implement changing the emoji
          transferItem(ac + operation * i, ac + operation * (i + 1));
          transferItem(ac, ac + operation);
          break;
        }
      }
    }
  }

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];

  async function handle(e: KeyboardEvent) {
    e.preventDefault();
    if (!items.has(ac) || playerFrozen || (player?.hp || -1) <= 0) {
      return;
    }
    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code as ArrowKey, ac);
      let item = player;
      if (item == undefined || $statics.has(item.emoji) || operation == 0)
        return;
      let facingItem = items.get(ac + operation);

      if (!facingItem) {
        transferItem(ac, ac + operation);
        return;
      }

      switch (getCollisionType(item.emoji, facingItem.emoji)) {
        case "push":
          enactPushCollision(operation);
          break;
        case "bump":
          break;
        default:
          // MERGE
          let mergeResult = getCollisionType(item.emoji, facingItem.emoji);
          console.log(mergeResult);
          transferItem(ac, ac + operation);
          player.emoji = mergeResult;
          break;
      }
    }

    if (e.code.includes("Digit")) {
      let digit = +e.code.replace("Digit", "");
      currentInventoryIndex =
        digit - 1 == currentInventoryIndex ? -1 : digit - 1;
      return;
    }

    if (wasd.includes(e.code)) {
      dirKey = e.code as Wasd;
      ic = ac + dirs[dirKey].operation;
      return;
    }

    if (e.code.includes("Control")) {
      // if (calcOperation(wasdToArrow[dirKey], ic) == 0) return;
      // let playerInventory = inventories.get(ac).inventories;
      // if (!playerInventory || items.has(ic)) return;
      // // TODO: Drop item
      // items.set(ic, playerInventory[currentInventoryIndex]);
      // playerInventory.splice(currentInventoryIndex, 1);
      // items = items;
      // inventories = inventories;
      return;
    }

    if (e.code == "KeyE") {
      // TODO: why is this 300?
      let closestDistance = 300;
      let closestID = ac;

      let _items = Array.from(items).filter(([id, val]) => !$statics.has(val));

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
        ic = ac + dirs[dirKey].operation;
      } else {
        ac = closestID;
        ic = ac + dirs[dirKey].operation;
      }

      progress = tweened(getHPpercentage(), {
        duration: 400,
        easing: cubicOut,
      });
      return;
    }

    if (e.code == "KeyQ") {
      let closestDistance = 300;
      let closestID = ac;

      let _items = Array.from(items).filter(
        ([id, { emoji }]) => !$statics.has(emoji)
      );

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
        ic = ac + dirs[dirKey].operation;
      } else {
        ac = closestID;
        ic = ac + dirs[dirKey].operation;
      }

      progress = tweened(getHPpercentage(), {
        duration: 400,
        easing: cubicOut,
      });
      return;
    }

    if (e.code == "Space") {
      if (calcOperation(wasdToArrow[dirKey], ic) == 0) return;
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
      let equippedItem = "any";

      // TODO:
      // if (inventories.has(ac)) {
      //   modifierKey = (inventories.get(ac) || [])[currentInventoryIndex];
      // }

      let modifier = modifiers.find((m) => m[0] == equippedItem);
      if (modifier == undefined) {
        modifier = modifiers[0];
      }

      if (modifier[1] == 0) return;

      let { current, max } = player?.hp || { current: 0, max: 0 };
      // hps.set(ic, { current: current + modifier[1], max });
      current += modifier[1];
      // TODO: check if this updates hp

      for (let { type, ...args } of sequence) {
        if (type == "wait") {
          await m.wait(args.duration);
        } else {
          m[type](args);
        }
      }

      let playerEvolve = _interactables[player?.emoji || ""].evolve;
      let playerDevolve = _interactables[player?.emoji || ""].devolve;

      // EVOLVE & DEVOLVE PLAYER
      if (current <= 0) {
        if (playerDevolve?.enabled && playerDevolve.to != "") {
          player.emoji = playerDevolve.to;
        } else {
          items.delete(ac);
        }
      } else if (playerEvolve?.enabled && playerEvolve.at == current) {
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
  }
</script>

<svelte:window on:keydown={handle} />

<div class="map">
  {#each { length: SIZE * SIZE } as _, i}
    {@const active = ac == i}
    <div style:background={backgrounds.get(i) || $map.dbg} class:active>
      {#if active}
        <div class="direction scale-75" style={dirs[dirKey].style}>
          {(player?.inventory || [])[currentInventoryIndex] ||
            dirs[dirKey].emoji}
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

{#key ac}
  <div
    class="absolute -bottom-8 flex w-64 flex-row items-center justify-center gap-2"
  >
    <progress class="progress progress-success h-4" value={$progress} />
  </div>
  <div
    class="absolute -bottom-24 flex w-full flex-row items-center justify-center gap-2"
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

<style>
  .selected {
    scale: 120%;
    border: 2px solid black;
  }
</style>
