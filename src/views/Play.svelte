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
  } from "../store";
  import { SIZE } from "$src/constants";
  import type { CollisionType } from "$src/types";

  interface _Collisions {
    [key1: string]: {
      [key2: string]: CollisionType;
    };
  }

  interface _Interactable {
    executing: boolean;
    sequence: Array<SequenceItem>;
    points: number;
    hp: number;
    modifiers: Array<[string, number]>;
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

  /* ## DATA ## */
  let _map = structuredClone($map);
  let items = new Map(_map.items);
  let backgrounds = new Map(_map.backgrounds);
  let hps = new Map<number, { max: number; current: number }>();
  let inventories = new Map<number, Array<string>>();
  let currentInventoryIndex = 0;

  let _interactables: _Interactables = {};

  for (let [id, interactable] of $interactables) {
    const { emoji, ...args } = interactable;
    // @ts-expect-error
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
  }

  for (let [index, emoji] of items) {
    if (ac != 2 && !$statics.has(emoji)) {
      ac = index;
      ic = ac + 1;
    }

    hps.set(index, {
      max: _interactables[emoji]?.hp || 0,
      current: _interactables[emoji]?.hp || 0,
    });
  }

  let progress = tweened(1, {
    duration: 400,
    easing: cubicOut,
  });

  let numbers = new Map<number, number>();

  for (let i = 0; i <= 100; i++) {
    numbers.set(i, i / 100);
  }

  function getPercentage(max: number, current: number) {
    return numbers.get(Math.floor((current * 100) / max)) || 0;
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
      items.set(index, emoji);
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
      items.set(ac, emoji);
    },
    addToPlayerInventory({ emoji }) {
      console.log(inventories.get(ac)?.length);

      if (emoji && inventories.get(ac)?.length != 4) {
        console.log("trigger");

        if (inventories.get(ac) == undefined) {
          inventories.set(ac, [emoji]);
        } else {
          console.log(inventories.get(ac));
          inventories.set(ac, [...inventories.get(ac), emoji]);
        }

        items.delete(ic);
        inventories = inventories;
        items = items;
      }
    },
    teleportPlayerTo({ index }) {
      let emoji = items.get(ac);
      items.delete(ac);
      // @ts-expect-error
      items.set(index, emoji);
      ac = index;
      items = items;
    },
    freezePlayer: () => (playerFrozen = true),
    unfreezePlayer: () => (playerFrozen = false),
    resetLevel: () => {
      backgrounds = new Map(_map.backgrounds);
      items = new Map(_map.items);
      ac = items.entries().next().value[0];
      ic = ac + 1;
      dirKey = "KeyD";
      levelCompleted = false;
    },
    completeLevel: () => (levelCompleted = true),
    addToPlayerHP: ({ points }) => {
      let { current, max } = hps.get(ac);
      current += points;
      hps.set(ac, { current, max });
      progress.set(getPercentage(max, current));
    },
  };

  function getCollisionType(key1: string, key2: string): CollisionType {
    if (!_collisions[key1]) return "bump";
    return _collisions[key1][key2] || "bump";
  }

  function syncData(operation: number) {
    if (inventories.size != 0) {
      inventories.set(ac, inventories.get(ac - operation));
      inventories.delete(ac - operation);
      inventories = inventories;
    }

    hps.set(ac, hps.get(ac - operation));
    hps.delete(ac - operation);
    hps = hps;
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
    }
    ac += operation;
    ic = ac + dirs[dirKey].operation;
    syncData(operation);
    items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY
  }

  function enactPushCollision(operation: number) {
    console.log(operation);

    let collisionChain = [];
    let i = 0;

    while (items.has(ac + operation * i)) {
      collisionChain.push(items.get(ac + operation * i) || "");
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
        let item = collisionChain.pop();
        if (item) {
          items.set(ac + operation * i--, item);
          items = items;
        }
      }

      let item = items.get(ac);
      if (item) {
        items.set(ac + operation, item);
        moveActiveCell(operation, true);
      }
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
          items.set(ac + operation * (i + 1), emoji);
          let item = items.get(ac);
          if (item) {
            items.set(ac + operation, item);
          }
          moveActiveCell(operation, true);
          break;
        }
      }
    }
  }

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];

  let animating = false; // TODO: Prevent player from moving when there is an interaction animation

  async function handle(e: KeyboardEvent) {
    e.preventDefault();
    if (
      !items.has(ac) ||
      playerFrozen ||
      (hps.has(ac) && hps.get(ac) <= 0) ||
      animating
    ) {
      return;
    }
    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code as ArrowKey, ac);
      let item = items.get(ac);
      if (item == undefined || $statics.has(item) || operation == 0) return;
      let postOpItem = items.get(ac + operation);

      // if there are no items in front of the player after operation, moveActiveCell
      if (!postOpItem) {
        items.set(ac + operation, item);
        moveActiveCell(operation, true);
        return;
      }

      switch (getCollisionType(item, postOpItem)) {
        case "push":
          enactPushCollision(operation);
          break;
        case "bump":
          break;
        default:
          // MERGE
          postOpItem = getCollisionType(item, postOpItem);
          moveActiveCell(operation, true);
          items.set(ac, postOpItem);
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
      if (calcOperation(wasdToArrow[dirKey], ic) == 0) return;
      let playerInventory = inventories.get(ac);
      if (!playerInventory || items.has(ic)) return;
      items.set(ic, playerInventory[currentInventoryIndex]);
      playerInventory.splice(currentInventoryIndex, 1);
      items = items;
      inventories = inventories;
      return;
    }

    if (e.code == "KeyE") {
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
      return;
    }

    if (e.code == "KeyQ") {
      let closestDistance = 300;
      let closestID = ac;

      let _items = Array.from(items).filter(([id, val]) => !$statics.has(val));

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
      return;
    }

    if (e.code == "Space") {
      if (calcOperation(wasdToArrow[dirKey], ic) == 0) return;
      let interactedItem = items.get(ic);
      if (interactedItem == undefined) return;
      let interactable: _Interactable = _interactables[interactedItem];
      if (interactable == undefined || interactable.executing) return;
      let { sequence, modifiers } = interactable;

      for (let { type, ...args } of sequence) {
        if (type == "addToPlayerInventory") {
          if (inventories.get(ac)?.length == 4) {
            return;
          }
        }
      }

      _interactables[interactedItem].executing = true;
      console.log("executing");

      let ce = "anything";

      if (inventories.has(ac)) {
        ce = inventories.get(ac)[currentInventoryIndex];
      }

      let modifier = modifiers.find((m) => m[0] == ce);
      if (modifier == undefined) {
        modifier = modifiers[0];
      }

      let hp = _interactables[interactedItem].hp;

      if (!hps.has(ic) && hp) {
        hps.set(ic, hp);
      }

      // _interactables[interactedItem].hp += modifier[1];
      hps.set(ic, hps.get(ic) + modifier[1]);

      // if (_interactables[interactedItem].hp <= 0) {
      //   items.delete(ic);
      // }
      if (hps.get(ic) <= 0) {
        items.delete(ic);
      }
      console.log(_interactables);

      items = items;
      hps = hps;

      for (let { type, ...args } of sequence) {
        if (type == "wait") {
          await m.wait(args.duration);
        } else {
          m[type](args);
        }
      }

      _interactables[interactedItem].executing = false;
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
          {(inventories.get(ac) &&
            inventories.get(ac)[currentInventoryIndex]) ||
            dirs[dirKey].emoji}
        </div>
      {/if}
      {items.get(i) || ""}
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
        {(inventories.get(ac) && inventories.get(ac)[i]) || ""}
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
