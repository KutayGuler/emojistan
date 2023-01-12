<script lang="ts">
  import { scale } from "svelte/transition";
  import { onDestroy, onMount } from "svelte/internal";
  import {
    map,
    pushes,
    merges,
    events,
    loopEvents,
    currentColor,
    currentEmoji,
    statics,
    palette,
    type Mutations,
    type SequenceItem,
    type TLoopEvent,
    type Loop,
    interactables,
  } from "../store";
  import { SIZE } from "$src/constants";

  onMount(() => {
    [$currentColor, $currentEmoji] = ["", ""];
  });

  type Wasd = "KeyW" | "KeyA" | "KeyS" | "KeyD";
  type ArrowKey = "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown";

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

  let playerHealth = 100;
  let playerFrozen = false;
  let levelCompleted = false;
  let ac: number; // ACTIVE CELL
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
  // let _interactables = structuredClone($interactables);
  let inventories = new Map<number, Array<string>>();
  let currentInventoryIndex = 0;
  // let healths = new Map(_map.healths);
  // let stacks = new Map(_map.stacks);
  let _collisions = new Map<string, Map<string, string>>();

  let firstItemIndex = items.entries().next().value;
  ac = firstItemIndex ? firstItemIndex[0] : -2;
  ic = ac + 1;

  interface _Interactable {
    action: keyof Mutations | "none";
    actionEmoji: string;
    points: number;
    health: number;
    modifiers: Array<[string, number]>;
  }

  interface _Interactables {
    [key: string]: _Interactable;
  }

  let _interactables: _Interactables = {};

  console.log($interactables);

  for (let [id, interactable] of $interactables) {
    const { emoji, ...args } = interactable;
    // @ts-expect-error
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
  }

  console.log(_interactables);

  // let controllables = [];
  // for (let c of _map.items.values()) {
  //   if (!$statics.has(c)) controllables.push(c);
  // }

  for (let [id, _slots] of [...$merges, ...$pushes]) {
    let [key1, key2, val] = _slots;
    if (!_collisions.has(key1)) {
      _collisions.set(key1, new Map());
    }
    _collisions.get(key1)?.set(key2, val);

    // making emoji merge both ways
    if (val != "push") {
      if (key1 != key2) {
        if (!_collisions.has(key2)) {
          _collisions.set(key2, new Map());
        }
        _collisions.get(key2)?.set(key1, val);
      }
    }
  }

  // MUTATIONS
  const m: Mutations = {
    setBackgroundOf({ index, background }, _start?) {
      backgrounds.set(_start || index, background);
      backgrounds = backgrounds;
    },
    removeBackgroundOf({ index }) {
      backgrounds.delete(index);
    },
    trailBackground({ index, background, iterationNumber }, _start?) {
      if (_start) backgrounds.delete(_start + iterationNumber * -1);
      backgrounds.set(_start || index, background);
      backgrounds = backgrounds;
    },
    spawn({ index, emoji }, _start?) {
      items.set(_start || index, emoji);
      items = items;
    },
    destroy({ index }) {
      items.delete(index);
    },
    trail({ index, emoji, iterationNumber }, _start?) {
      if (_start) items.delete(_start + iterationNumber * -1);
      items.set(_start || index, emoji);
      items = items;
    },
    wait: async (duration) => {
      return new Promise((resolve) => {
        let timer = setTimeout(resolve, duration);
        timeouts.push(timer);
      });
    },
    changePlayerTo(emoji) {
      items.set(ac, emoji);
    },
    addToInventory(interactedItem) {
      // let interactedItem = items.get(ic);
      if (interactedItem && inventories.get(ac)?.length != 4) {
        console.log("trigger");

        if (inventories.get(ac) == undefined) {
          inventories.set(ac, [interactedItem]);
        } else {
          console.log(inventories.get(ac));
          inventories.set(ac, [...inventories.get(ac), interactedItem]);
        }

        items.delete(ic);
        inventories = inventories;
        items = items;
        console.log(inventories);
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
  };

  function getCollisionType(key1: string, key2: string): string {
    if (_collisions.has(key1)) {
      return _collisions.get(key1)?.get(key2) || "bump";
    }
    return "bump";
  }

  function syncData(operation: number) {
    if (inventories.size == 0) return;
    inventories.set(ac, inventories.get(ac - operation));
    inventories.delete(ac - operation);
    inventories = inventories;
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
    }
    ac += operation;
    ic = ac + dirs[dirKey].operation;
    syncData(operation);
  }

  function enactPushCollision(operation: number) {
    let collisionChain = [];
    let i = 0;

    while (items.get(ac + operation * i)) {
      collisionChain.push(items.get(ac + operation * i));
      i++;
    }

    let arr = [];
    for (let i = 0; i < collisionChain.length; i++) {
      let current = collisionChain[i];
      let next = collisionChain[i + 1];
      if (current && next) {
        arr.push(_collisions.get(current)?.get(next));
      }
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
        let cur = collisionChain[i];
        let next = collisionChain[i + 1];

        if (!(next && cur)) continue;

        let emoji = _collisions.get(cur)?.get(next);
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

  let animating = false; // TODO:
  function handle(e: KeyboardEvent) {
    if (playerFrozen || playerHealth <= 0 || animating) return;
    e.preventDefault();
    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code as ArrowKey, ac);
      if (!items.has(ac)) {
        moveActiveCell(operation);
        return;
      }
      let item = items.get(ac);
      if (item == undefined || $statics.has(item)) return;
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

    if (wasd.includes(e.code)) {
      dirKey = e.code as Wasd;
      ic = ac + dirs[dirKey].operation;
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
      let interactedItem = items.get(ic);
      if (interactedItem == undefined) return;
      let interactable: _Interactable = _interactables[interactedItem];
      if (interactable == undefined) return;
      let { action, actionEmoji, points, modifiers } = interactable;

      if (action != "none") {
        if (action == "changePlayerHealthBy") {
          m.changePlayerHealthBy(points);
        } else {
          m[action](actionEmoji);
        }
      }

      let ce = "nothing";

      if (inventories.get(ac) != undefined) {
        ce = inventories.get(ac)[currentInventoryIndex];
      }

      let modifier = modifiers.find((m) => m[0] == ce);
      if (modifier == undefined) {
        modifier = modifiers[0];
      }

      _interactables[interactedItem].health += modifier[1];

      if (_interactables[interactedItem].health <= 0) {
        items.delete(ic);
      }
      console.log(_interactables);

      items = items;
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

{#each [...inventories.entries()] as [key, inventory]}
  {#if key == ac}
    <p class="">{key}: {inventory}</p>
    {#each inventory as item, i}
      <div class={i == currentInventoryIndex ? "scale-150" : ""}>{item}</div>
    {/each}
  {/if}
{/each}
