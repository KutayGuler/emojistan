<script lang="ts">
  import { scale } from "svelte/transition";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { createEventDispatcher, onDestroy, onMount } from "svelte/internal";
  import { currentColor, currentEmoji, saves } from "../store";
  import {
    DEFAULT_MAP_CLASS,
    DEFAULT_SIDE_LENGTH,
    MAX_INVENTORY_SIZE,
  } from "$src/constants";
  import {
    Consumable,
    Equippable,
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
    type _Consumables,
    type _Equippables,
    HP,
  } from "$src/types";

  /* ## DATA ## */
  export let map: EditableMap;
  export let pushers = new Map<number, [string, string, CollisionType]>();
  export let mergers = new Map<number, [string, string, CollisionType]>();
  export let equippables = new Map<number, Equippable>();
  export let interactables = new Map<number, Interactable>();
  export let consumables = new Map<number, Consumable>();
  export let statics = new Set<string>();
  export let mapClass = DEFAULT_MAP_CLASS;
  export let SIZE = DEFAULT_SIDE_LENGTH;
  export let showHP = true;
  export let showInventory = true;
  export let showObjective = true;

  /* ## STATE ## */
  let levelCompleted = false;
  let ac = -2; // ACTIVE CELL
  let ic: number; // INTERACTED CELL
  let directionKey: Wasd = "KeyD";
  let currentInventoryIndex = 0;
  let items = new Map<number, Item | Equippable | Consumable>();
  let backgrounds = new Map(map.backgrounds);
  let _interactables: _Interactables = {};
  let _consumables: _Consumables = {};
  let _equippables: _Equippables = {};
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

  const dispatch = createEventDispatcher();
  const keys: {
    [key in Wasd]: { emoji: string; operation: number };
  } = {
    KeyW: { emoji: "⬆️", operation: -SIZE },
    KeyA: { emoji: "⬅️", operation: -1 },
    KeyS: { emoji: "⬇️", operation: SIZE },
    KeyD: { emoji: "➡️", operation: 1 },
  };

  const wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];

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
      ic = ac + keys[directionKey].operation;
    }
  }

  /**
   * function mutates ac if it is equal to "from" parameter
   * Transfers an item from "from" to "to" and applies mergeResult
   */
  function transferAndMerge(fromID: number, toID: number, mergeResult: string) {
    let from = items.get(fromID) as Item;
    let fromInventory: Array<Equippable> = from?.inventory || [];
    let fromHP = from?.hp.current || 1;
    // @ts-expect-error
    let toInventory: Array<Equippable> = items.get(toID)?.inventory || [];
    let mergedInventory = [...fromInventory, ...toInventory];
    while (mergedInventory.length > MAX_INVENTORY_SIZE) {
      mergedInventory.pop();
    }

    items.set(
      toID,
      new Item(
        mergeResult,
        mergedInventory,
        _interactables[mergeResult]?.hp || fromHP
      )
    );
    items.delete(fromID);
    items = items; // MAGIC UPDATE, NECESSARY FOR REACTIVITY

    if (ac == fromID) {
      ac = toID;
      ic = ac + keys[directionKey].operation;
    }
  }

  for (let [id, interactable] of interactables) {
    const { emoji, ...args } = interactable;
    if (emoji == "") continue;
    // @ts-expect-error
    _interactables[emoji] = {};
    Object.assign(_interactables[emoji], args);
  }

  console.log(_interactables);

  for (let [id, consumable] of consumables) {
    const { emoji, ...args } = consumable;
    if (emoji == "") continue;
    // @ts-expect-error
    _consumables[emoji] = {};
    Object.assign(_consumables[emoji], args);
  }

  for (let [id, equippable] of equippables) {
    const { emoji, ...args } = equippable;
    if (emoji == "") continue;
    // @ts-expect-error
    _equippables[emoji] = {};
    Object.assign(_equippables[emoji], args);
  }

  console.log(_equippables);

  function initItems() {
    for (let [id, _emoji] of map.items) {
      if (_equippables[_emoji]) {
        items.set(id, new Equippable(_emoji, _equippables[_emoji].hp));
      } else if (_consumables[_emoji]) {
        let { hp, mutateConsumerTo } = _consumables[_emoji];
        items.set(id, new Consumable(_emoji, hp, mutateConsumerTo));
      } else {
        items.set(id, new Item(_emoji));
      }
    }

    for (let [index, { emoji, hp }] of items) {
      if (typeof hp == "number") continue; // consumable and equippables' hp types are numbers
      if (ac == -2 && !statics.has(emoji)) {
        ac = index;
        ic = ac + 1;
        directionKey = "KeyD";
      }

      hp.max = _interactables[emoji]?.hp || 1;
      hp.current = _interactables[emoji]?.hp || 1;
    }
  }

  initItems();

  // FIXME: There is a problem with items that have maxxed
  // and plussed out their hps when they are damaged
  // (percentage issue)

  let player = items.get(ac) as Item;
  $: player = items.get(ac) as Item;

  let numbers = new Map<number, number>();

  for (let i = 0; i <= 100; i++) {
    numbers.set(i, i / 100);
  }

  function calcPlayerHpPercentage(): number {
    if (!player) return 0;
    let { hp } = player;
    if (!hp) return 0;
    if (hp.current > hp.max) return 1;
    return numbers.get(Math.floor((hp.current * 100) / hp.max)) || 0;
  }

  let progress = tweened(calcPlayerHpPercentage(), {
    duration: 200,
    easing: cubicOut,
  });

  let _collisions: _Collisions = {};

  for (let [id, _slots] of [...mergers, ...pushers]) {
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
    paint({ index, background }) {
      backgrounds.set(index, background);
      backgrounds = backgrounds;
    },
    erase({ index }) {
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
    dropEquippable({ emoji }) {
      if (emoji && player?.inventory.length != MAX_INVENTORY_SIZE) {
        // @ts-expect-error
        player?.inventory.push(emoji);
        items = items;
      }
    },
    resetLevel: () => {
      items.clear();
      backgrounds = new Map(map.backgrounds);
      ac = -2;
      initItems();
      items = items;
      levelCompleted = false;
    },
    completeLevel: () => (levelCompleted = true),
  };
  // TODO: Add "Game Over (no players left)"

  function getCollisionType(key1: string, key2: string): CollisionType {
    if (!_collisions[key1]) return "bump";
    return _collisions[key1][key2] || "bump";
  }

  function enactPushCollision(operation: number) {
    let collisionChain = [];
    let i = 0;

    while (items.has(ac + operation * i)) {
      collisionChain.push(items.get(ac + operation * i)?.emoji);
      i++;
    }

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
    if (!items.has(ac) || (player?.hp.current || -1) <= 0) return;

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

    if (wasd.includes(e.code)) {
      directionKey = e.code as Wasd;
      ic = ac + keys[directionKey].operation;
      return;
    }

    if (e.code == "Space") {
      // required so that items are not overflowing from the map
      if (calcOperation(wasdToArrow[directionKey], ac) == 0) {
        return;
      }
      let interactedItem = items.get(ic);
      console.log(interactedItem);

      if (interactedItem == undefined) return;
      if (interactedItem instanceof Equippable) {
        if (player.inventory.length != MAX_INVENTORY_SIZE) {
          player.inventory.push(interactedItem);
          items.delete(ic);
          items = items;
        }
        return;
      } else if (interactedItem instanceof Consumable) {
        let { hp, mutateConsumerTo } = interactedItem;

        if (!player) return;

        if (mutateConsumerTo != "") {
          player.emoji = mutateConsumerTo;
        } else {
          player.hp.add(hp);

          if (player.hp.current <= 0) {
            let playerDevolve = _interactables[player?.emoji || ""]?.devolve;

            if (playerDevolve.enabled) {
              player.emoji = playerDevolve.to;
              player.hp.max = _interactables[playerDevolve.to]?.hp || 1;
              player.hp.current = player.hp.max;
              progress.set(calcPlayerHpPercentage());
              items.delete(ic);

              items = items;
              return;
            }

            items.delete(ac);
            items = items;

            for (let [id, { emoji, hp }] of items) {
              if (typeof hp == "number") continue; // consumables and equippables' hp types are numbers
              if (
                hp.current > 0 &&
                !statics.has(emoji) &&
                !_equippables[emoji]
              ) {
                player = items.get(id) as Item;
                ac = id;
                progress = tweened(calcPlayerHpPercentage(), {
                  duration: 200,
                  easing: cubicOut,
                });

                return;
              }
            }
          }

          let playerEvolve = _interactables[player?.emoji || ""]?.evolve;

          if (playerEvolve.enabled && player.hp.current == playerEvolve?.at) {
            player.emoji = playerEvolve.to;
            player.hp.max = _interactables[playerEvolve.to]?.hp || 1;
            player.hp.current = player.hp.max;
          }

          progress.set(calcPlayerHpPercentage());
        }

        items.delete(ic);
        items = items;
        return;
      }

      let interactable: _Interactable = _interactables[interactedItem.emoji];
      console.log(interactable);

      if (interactable == undefined || interactable.executing) return;
      let { sequence, sideEffects, evolve, devolve } = interactable;

      for (let { type } of sequence) {
        if (type == "dropEquippable") {
          if (player?.inventory.length == MAX_INVENTORY_SIZE) {
            return;
          }
        }
      }

      _interactables[interactedItem.emoji].executing = true;
      let equippedItem = player?.inventory[currentInventoryIndex] || "any";

      console.log(equippedItem);
      // @ts-expect-error
      if (equippedItem != "any") {
        equippedItem.hp -= 1;
      }

      if (equippedItem.hp == 0) {
        player.inventory.splice(currentInventoryIndex, 1);
      }
      console.log(sideEffects);

      let sideEffect =
        sideEffects.find(
          (m) => equippables.get(m[0])?.emoji == equippedItem.emoji
        ) || sideEffects[0];

      console.log(sideEffect);

      if (sideEffect[1] == 0) return;
      interactedItem.hp.current += sideEffect[1];

      for (let { type, ...args } of sequence) {
        if (type == "wait") {
          await m.wait(args.duration);
        } else {
          let res = m[type](args);
          if (res == "cancelLoop") {
            break;
          }
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
        calcOperation(wasdToArrow[directionKey], ac) == 0 ||
        !player?.inventory ||
        items.has(ic)
      ) {
        return;
      }
      items.set(ic, player?.inventory[currentInventoryIndex]);
      player.inventory.splice(currentInventoryIndex, 1);
      items = items;
      return;
    }

    let closestDistance = 300;
    let closestID = ac;

    let _items = Array.from(items).filter(
      ([id, { emoji }]) => !statics.has(emoji) && !_equippables[emoji]
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
        ic = ac + keys[directionKey].operation;
      } else {
        ac = closestID;
        ic = ac + keys[directionKey].operation;
      }

      player = items.get(ac) as Item;
      progress = tweened(calcPlayerHpPercentage(), {
        duration: 200,
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
        ic = ac + keys[directionKey].operation;
      } else {
        ac = closestID;
        ic = ac + keys[directionKey].operation;
      }

      player = items.get(ac) as Item;
      progress = tweened(calcPlayerHpPercentage(), {
        duration: 200,
        easing: cubicOut,
      });
      return;
    }
  }

  function noPlayer(node: any) {
    if (ac == -2) dispatch("noPlayer");
  }
</script>

<svelte:window on:keydown={handle} />

<div class={mapClass} use:noPlayer>
  {#each { length: SIZE * SIZE } as _, i}
    {@const active = ac == i}
    {@const item = items.get(i)}
    {@const equippable = item instanceof Equippable}
    {@const consumable = item instanceof Consumable}
    <div style:background={backgrounds.get(i) || map.dbg}>
      {#if active}
        <div class="absolute z-[2] text-base {directionKey}">
          {player?.inventory[currentInventoryIndex]?.emoji ||
            keys[directionKey].emoji}
        </div>
      {/if}
      <span class:equippable class:consumable>
        {item?.emoji || ""}
      </span>
    </div>
  {/each}
  {#if levelCompleted}
    <!--   -->
    <dialog
      open
      style="background-color: rgba(0, 0, 0.5, 0.5);"
      class="absolute z-20 flex h-full w-1/2 flex-col items-center justify-center self-center "
      transition:scale
    >
      <p class="w-full text-white">LEVEL COMPLETED!</p>
      <button
        class="btn btn-success text-success-content"
        on:click={() => m.resetLevel()}>REPLAY</button
      >
      <button
        class="btn btn-error text-error-content"
        on:click={() => (levelCompleted = !levelCompleted)}>QUIT</button
      >
    </dialog>
  {/if}
</div>

{#if ac != -2}
  {#if showObjective}
    <label
      title="Objective"
      for="objective"
      class="absolute -top-16 left-0 cursor-help text-2xl">🎯</label
    >

    <input type="checkbox" id="objective" class="modal-toggle" />
    <label for="objective" class="modal cursor-pointer">
      <label class="modal-box relative" for="">
        <h3 class="text-lg font-bold">{$saves.currentSaveName}</h3>
        <p class="py-4">
          {map.objective}
        </p>
      </label>
    </label>
  {/if}
  {#key ac}
    {#if showHP}
      {@const playerHP = $progress * (player?.hp.max || 1)}
      <div
        class="absolute -top-16 flex w-64 flex-row items-center justify-center gap-2"
      >
        <p class="absolute -left-4 z-10 self-start text-2xl">
          {player?.emoji || ""}
        </p>
        <!-- progress-success -->
        <progress title="Health Bar" class="progress h-8" value={$progress} />
        <p class="absolute">
          {Number.isInteger(playerHP) ? playerHP : playerHP.toFixed(1)}
        </p>
      </div>
    {/if}
    {#if showInventory}
      <div
        title="Inventory"
        class="absolute -bottom-20 flex w-full flex-row items-center justify-center gap-2"
      >
        {#each { length: MAX_INVENTORY_SIZE } as _, i}
          {@const item = player?.inventory[i]}
          {@const equipped = i == currentInventoryIndex}
          <div
            class:equipped
            class="relative flex h-12 w-12 flex-col items-center justify-center bg-base-300 p-2"
          >
            {#if item}
              <div>{item.emoji || ""}</div>
              <div class="absolute -top-0.5 right-0.5 text-sm">
                {item.hp > 1 ? item.hp : ""}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  {/key}
{/if}

<style>
  /* DIRECTIONS */
  :root {
    --off: -25%;
  }

  .KeyW {
    top: var(--off);
  }

  .KeyA {
    left: var(--off);
  }

  .KeyS {
    bottom: var(--off);
  }

  .KeyD {
    right: var(--off);
  }

  .equipped {
    scale: 120%;
    border: 2px solid black;
  }

  @keyframes equippable {
    100% {
      transform: translateY(-2px);
    }
  }

  @keyframes consumable {
    100% {
      transform: scale(0.85);
    }
  }

  .equippable {
    animation: equippable 500ms linear infinite alternate;
  }

  .consumable {
    animation: consumable 1000ms linear infinite alternate;
  }

  progress::-webkit-progress-value {
    background: var(--consumable);
  }
</style>
