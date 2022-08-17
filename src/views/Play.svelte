<script lang="ts">
  import { scale } from "svelte/transition";
  import { onDestroy, onMount } from "svelte/internal";
  import {
    map,
    pushes,
    merges,
    conditions,
    events,
    currentColor,
    currentEmoji,
    modal,
    statics,
  } from "../store";
  import { invertColor } from "../utils/invertColor";

  let r: any;
  let defaultBackground = "";

  onMount(() => {
    r = document.querySelector(":root");
    defaultBackground = r.style.getPropertyValue("--default-background");
    if (defaultBackground == "") defaultBackground = "#faebd7";
    [$currentColor, $currentEmoji] = ["", ""];
  });

  // TODO: Revise calcOperation
  function calcOperation(
    _code: string,
    index: number,
    translate = false,
    opposite = false
  ) {
    let code = _code;
    if (translate) {
      if (code == "KeyW") code = opposite ? "ArrowDown" : "ArrowUp";
      if (code == "KeyA") code = opposite ? "ArrowRight" : "ArrowLeft";
      if (code == "KeyS") code = opposite ? "ArrowUp" : "ArrowDown";
      if (code == "KeyD") code = opposite ? "ArrowLeft" : "ArrowRight";
    }
    if (code == "ArrowLeft" && index % 16 == 0) return 0;
    if (code == "ArrowUp" && index < 16) return 0;
    if (code == "ArrowRight" && (index + 1) % 16 == 0) return 0;
    if (code == "ArrowDown" && index >= 240) return 0;
    return (
      (["ArrowUp", "ArrowDown"].includes(code) ? 16 : 1) *
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

  let levelCompleted = false;
  let ac: number; // ACTIVE CELL
  let adc: number; // ADJACENT CELL
  let dirs: {
    [key: string]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -16 },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: 16 },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };
  let dirKey = "KeyD";
  let currentItem = "";
  let inventoryIndex = 0;

  /* ## DATA ## */
  let _events = new Map($events);
  let _map = structuredClone($map);
  let items = new Map(_map.items);
  let backgrounds = new Map(_map.backgrounds);
  let _collisions = new Map<string, Map<string, string>>();

  ac = items.entries().next().value[0];
  adc = ac + 1;

  let controllables = [];
  for (let c of _map.items.values()) {
    if (!$statics.has(c.emoji)) controllables.push(c.emoji);
  }

  console.log(controllables);

  for (let [id, { rule }] of [...$merges, ...$pushes]) {
    let [key1, key2, val] = rule;
    if (!_collisions.has(key1)) {
      _collisions.set(key1, new Map());
    }
    _collisions.get(key1)?.set(key2, val);

    // making emoji merge both ways
    // TODO: Check if it still works
    if (val != "push") {
      if (key1 != key2) {
        if (!_collisions.has(key2)) {
          _collisions.set(key2, new Map());
        }
        _collisions.get(key2)?.set(key1, val);
      }
    }
  }

  function equip(item: string, destroy = false) {
    console.log(item);
    if (!items.get(adc) || !items.get(ac)) return;
    if (item == "") item = items.get(adc).emoji;
    let player = items.get(ac);
    if (!player.inventory) {
      player.inventory = ["", "", "", ""];
    }

    let inventory = player.inventory;
    if (inventory.includes("")) {
      let index = inventory.indexOf("");
      inventory[index] = item;
      currentItem = item;
      if (destroy) items.delete(adc);
      items = items;
    }
  }

  const mutations = {
    setBackgroundOf: (
      { index, background }: { index: number; background: string },
      _start?: number
    ) => {
      backgrounds.set(_start || index, background);
      backgrounds = backgrounds;
    },
    removeBackgroundOf: ({ index }: { index: number }) => {
      backgrounds.delete(index);
    },
    equipItem: ({ emoji }: { emoji: string }) => equip(emoji),
    equipInteractedItem: () => equip("", true),
    consumeEquippedItem: () => {
      items.get(ac).inventory[inventoryIndex] = "";
      currentItem = "";
      items = items;
    },
    fireProjectile: ({
      emoji,
      duration,
    }: {
      emoji: string;
      duration: number;
    }) => {
      console.log("started");
      let key = dirKey;
      let index = adc;
      items.set(index, { emoji });
      items = items;
      let interval = setInterval(() => {
        let deleted = items.delete(index);
        console.log(deleted);

        if (!deleted) {
          items = items;
          clearInterval(interval);
          return;
        }
        let operation = calcOperation(key, index, true);
        if (operation == 0 || items.get(index + operation)) {
          // hit by projectile
          // push, merge, bump
          items.delete(index);
          items = items;
          clearInterval(interval);
          return;
        }

        index += operation;
        items.set(index, { emoji });
        items = items;
      }, duration);
      intervals.push(interval);
    },
    spawn: (
      { index, emoji }: { index: number; emoji: string },
      _start?: number
    ) => {
      items.set(_start || index, { emoji });
      items = items;
    },
    destroy: ({ index }: { index: number }) => {
      items.delete(index);
    },
    wait: async (duration: number) => {
      return new Promise((resolve) => {
        let timer = setTimeout(resolve, duration);
        timeouts.push(timer);
      });
    },
    resetLevel: () => {
      backgrounds = new Map(_map.backgrounds);
      items = new Map(_map.items);
      ac = items.entries().next().value[0];
      adc = ac + 1;
      dirKey = "KeyD";
      levelCompleted = false;
    },
    completeLevel: () => (levelCompleted = true),
  };

  let _conditions = new Map<number, { condition: Function; event: Function }>();
  let _interactables = new Set<string>();

  for (let [id, condition] of $conditions.entries()) {
    let a: Function;
    let b: string = condition.b;
    let _b: string = condition._b;
    // if not hex string, add as interactable
    // EDGE interactable
    if (b[0] != "#") {
      _interactables.add(b);
    }

    switch (condition.a) {
      case "playerBackground":
        a = () => backgrounds.get(ac);
        break;
      case "playerInteractsWith":
        a = () => {
          let interactedItem = items.get(adc);
          if (interactedItem != undefined) {
            if (!_interactables.has(interactedItem.emoji)) return "";
            if (playerInteracted) {
              return [
                interactedItem.emoji + "," + currentItem,
                interactedItem.emoji + ",any",
              ];
            } else {
              return "";
            }
          } else {
            return "";
          }
        };
        break;
    }

    let eventQueue: Array<Function> = [];

    let event = _events.get(condition.eventID);
    if (event == undefined) continue;
    let sequence = event.sequence;

    let loop = structuredClone(event.loop);
    let start: number, end: number, op: number;
    if (loop != undefined) {
      start = loop.start;
      end = loop.end;
      op = loop.iterationNumber * (loop.iterationType == "increment" ? 1 : -1);
    }

    for (let { type, ...args } of sequence) {
      if (type == "wait") {
        eventQueue.push(async () => await mutations.wait(args.duration || 50)); // MAGIC NUMBER
      } else {
        // @ts-expect-error
        eventQueue.push((_start?: number) => mutations[type](args, _start));
      }
    }

    if (event.loop != undefined) {
      let duration = event.loop.timeGap;
      eventQueue.push(
        async () =>
          await new Promise((resolve) => {
            let timer = setTimeout(resolve, duration);
            timeouts.push(timer);
          })
      );
    }

    async function execute(i: number, _start?: number) {
      await eventQueue[i](_start);
      if (i + 1 == eventQueue.length) {
        if (event && event.loop == undefined) return;
        start += op;
        if (start >= end) {
          // @ts-expect-error
          start = loop.start;
        } else {
          execute(0, start);
        }
      } else {
        execute(i + 1);
      }
    }

    _conditions.set(+id, {
      condition: () => {
        if (condition.a == "playerBackground") {
          return a() == b;
        } else {
          return a().includes(`${b},${_b}`);
        }
      },
      event: () => {
        if (eventQueue.length == 0) return;
        execute(0);
      },
    });
  }

  function getCollisionType(key1: string, key2: string): string {
    if (_collisions.has(key1)) {
      return _collisions.get(key1)?.get(key2) || "bump";
    }
    return "bump";
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
      items = items;
    }
    ac += operation;
    adc = ac + dirs[dirKey].operation;
    r.style.setProperty(
      "--inverted",
      invertColor(backgrounds.get(ac) || defaultBackground)
    );
    if (items.has(ac)) {
      for (let c of _conditions.values()) {
        if (c.condition()) c.event();
      }
    }

    // MAGIC UPDATE, NECESSARY FOR REACTIVITY
    items = items;
  }

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];
  let playerInteracted = false;

  let emojiStyle = "";

  function handle(e: KeyboardEvent) {
    console.log(e.code);
    if (e.code == "KeyE") {
      let closestDistance = 300;
      let closestID = ac;

      for (let [id, _] of items) {
        if (id == ac) continue;
        if (id > ac && id - ac < closestDistance) {
          closestDistance = id - ac;
          closestID = id;
        }
      }

      if (closestDistance == 300) {
        let smallest = 300;
        for (let [id, _] of items) {
          if (id < smallest) smallest = id;
        }
        ac = smallest;
        adc = ac + dirs[dirKey].operation;
        // TODO Figure out
      } else {
        ac = closestID;
        adc = ac + dirs[dirKey].operation;
      }
      return;
    }

    if (e.code == "KeyQ") {
      // TODO: this
      return;
    }

    if (e.code == "Space") {
      if (calcOperation(dirKey, adc, true, true) == 0) {
        playerInteracted = false;
        return;
      }

      playerInteracted = true;
      if (items.has(ac)) {
        for (let c of _conditions.values()) {
          if (c.condition()) c.event();
        }
      }
      return;
    }

    if (e.code.includes("Digit")) {
      let num = +e.code.replace("Digit", "");
      if (num >= 1 && num <= 4) {
        if (inventoryIndex == num - 1) {
          inventoryIndex = -1;
          currentItem = "";
        } else {
          inventoryIndex = num - 1;
          currentItem = items.get(ac).inventory[inventoryIndex];
        }
      }
      return;
    }

    if (e.code == "KeyX") {
      if (calcOperation(dirKey, adc, true, true) == 0) {
        playerInteracted = false;
        return;
      }

      if (!items.get(adc)) {
        items.set(adc, { emoji: currentItem });
        items.get(ac).inventory[inventoryIndex] = "";
        currentItem = "";
        items = items;
      }
      return;
    }
    playerInteracted = false;
    if (wasd.includes(e.code)) {
      dirKey = e.code;
      adc = ac + dirs[dirKey].operation;
      return;
    }
    if (!e.code.includes("Arrow")) return;
    let operation = calcOperation(e.code, ac);
    if (operation == 0) {
      emojiStyle = "transform: translateX(5%);";
      return;
    }
    if (!items.has(ac)) {
      moveActiveCell(operation);
      return;
    }
    let item = items.get(ac);
    if (item == undefined || $statics.has(item.emoji)) return;
    let postOpItem = items.get(ac + operation);
    if (postOpItem) {
      switch (getCollisionType(item.emoji, postOpItem.emoji)) {
        case "push":
          let collisionChain = [];
          let i = 1;
          while (items.get(ac + operation * i)) {
            collisionChain.push(items.get(ac + operation * i));
            i++;
          }

          let arr = [];
          for (let i = 0; i < collisionChain.length; i++) {
            let cur = collisionChain[i]?.emoji;
            let next = collisionChain[i + 1]?.emoji;
            if (cur && next) {
              arr.push(_collisions.get(cur)?.get(next));
            }
          }

          let finalIndex = ac + operation * (i - 1);
          let code = "";

          if (operation == 1) code = "ArrowRight";
          if (operation == -1) code = "ArrowLeft";
          if (operation == 16) code = "ArrowDown";
          if (operation == -16) code = "ArrowUp";

          if (calcOperation(code, finalIndex) == 0) break;

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
              items = items;
            }
          } else if (
            arr.some((str) => [undefined, "push", "bump"].includes(str))
          ) {
            arr = arr.slice(
              0,
              arr.findIndex((str) =>
                [undefined, "push", "bump"].includes(str)
              ) + 1
            );

            for (let i = 0; i < arr.length + 2; i++) {
              let cur = collisionChain[i]?.emoji;
              let next = collisionChain[i + 1]?.emoji;
              if (next && cur) {
                let emoji = _collisions.get(cur)?.get(next);
                if (emoji && emoji != "push") {
                  // TODO: Fix spawning double emojis on merge
                  items.set(ac + operation * (i + 2), { emoji });
                  items.set(ac + operation, items.get(ac));
                  items = items;
                  moveActiveCell(operation, true);
                  break;
                }
              }
            }
          }
          break;
        case "bump":
          break;
        default:
          // MERGE
          postOpItem.emoji = getCollisionType(item.emoji, postOpItem.emoji);
          moveActiveCell(operation, true);
          items.set(ac + operation, postOpItem);
          items = items;
          break;
      }
    } else {
      if (item.inventory) {
        let { emoji, inventory } = item;
        items.set(ac + operation, { emoji, inventory });
      } else {
        items.set(ac + operation, { emoji: item.emoji });
      }
      items = items;
      moveActiveCell(operation, true);
    }
  }

  let canFire = true;

  function fire() {
    if (!canFire) return;

    mutations.fireProjectile({ emoji: "💩", duration: 1000 });
    canFire = false;
    setTimeout(() => (canFire = true), 500);
  }
</script>

<svelte:window on:keydown={handle} />

<section class="playable-map">
  <p class="keyboard" on:click={() => modal.show("keyboard")}>⌨️</p>
  <section class="noselect">
    <button on:click={fire}>FIRE</button>
    <p><strong>Objective: </strong>{_map.objective || "?"}</p>
    <div class="inventory">
      {#each items.get(ac)?.inventory || [] as item, i}
        <div class:currentItem={i == inventoryIndex}>{item}</div>
      {/each}
    </div>
    <div class="map">
      {#each { length: 256 } as _, i}
        {@const controlling = items.has(ac)}
        {@const active = ac == i}
        <div
          style:transform={emojiStyle}
          style:background={backgrounds.get(i) || ""}
          class:adc={adc == i &&
            controlling &&
            calcOperation(dirKey, adc, true, true) != 0}
          class:active
        >
          {#if active && controlling && calcOperation(dirKey, i, true) != 0}
            <div class="direction" style={dirs[dirKey].style}>
              {currentItem || dirs[dirKey].emoji}
            </div>
          {/if}
          {items.get(i)?.emoji || ""}
        </div>
      {/each}
      {#if levelCompleted}
        <dialog open bind:this={dialog} transition:scale>
          LEVEL COMPLETED!
          <button on:click={() => (levelCompleted = !levelCompleted)}>OK</button
          >
          <button on:click={mutations.resetLevel}>REPLAY</button>
        </dialog>
      {/if}
    </div>
  </section>
</section>

<style>
  .playable-map {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 90vh;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .active {
    outline: 2px solid var(--inverted);
  }

  .adc {
    outline: 1px dotted var(--inverted);
  }

  .keyboard {
    font-size: 2rem;
    position: absolute;
    padding: 0;
    margin: 0;
    top: 2%;
    right: 2%;
    transition: 200ms ease-out;
    cursor: help;
  }

  .keyboard:hover {
    transform: scale(150%);
  }

  .inventory {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2%;
  }

  .inventory > div {
    min-width: 30px;
    min-height: 30px;
    border: 2px solid black;
  }

  .currentItem {
    transform: scale(120%);
  }
</style>
