<script lang="ts">
  import type { Emoji } from "../store";
  import { scale } from "svelte/transition";
  import { onMount } from "svelte/internal";
  import {
    editableMap as map,
    collisions,
    conditions,
    events,
    statics,
    currentItem,
    currentColor,
    currentEmoji,
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

  function calcOperation(code: string, index: number) {
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
  let levelCompleted = false;
  let ac = 0; // ACTIVE CELL
  let adc = 1; // ADJACENT CELL
  let ghost = true;
  let collisionChain: Array<any> = [];
  let dirs: {
    [key: string]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -16 },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: 16 },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };
  let dirKey = "KeyD";

  /* ## DATA ## */
  let _events = new Map($events);
  let _map = structuredClone($map);
  let items = new Map(_map.items);
  let backgrounds = new Map(_map.backgrounds);
  let _collisions = new Map<string, Map<string, string>>();

  for (let rule of $collisions.values()) {
    let [key1, key2, val] = rule.split(",");
    if (!_collisions.has(key1)) {
      _collisions.set(key1, new Map());
    }
    _collisions.get(key1)?.set(key2, val);

    // making emoji merge both ways
    if (/\p{Extended_Pictographic}/gu.test(val)) {
      if (key1 != key2) {
        if (!_collisions.has(key2)) {
          _collisions.set(key2, new Map());
        }
        _collisions.get(key2)?.set(key1, val);
      }
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
    spawn: ({ index, emoji }: Emoji, _start?: number) => {
      items.set(_start || index, { index: _start || index, emoji });
      items = items;
    },
    destroy: ({ index }: { index: number }) => {
      items.delete(index);
    },
    wait: async (duration: number) => {
      return new Promise((resolve: Function) => {
        let timer = setTimeout(resolve, duration);
        clearTimeout(timer);
      });
    },
    reset: () => {
      backgrounds = new Map(_map.backgrounds);
      items = new Map(_map.items);
      ac = 0;
      adc = 1;
      dirKey = "KeyD";
      levelCompleted = false;
      ghost = true;
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
            if (!_interactables.has(interactedItem.emoji)) return;
            if (playerInteracted) {
              return [
                interactedItem.emoji + "," + $currentItem,
                interactedItem.emoji + ",any",
              ];
            } else {
              return "";
            }
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
            clearTimeout(timer);
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
    if (_collisions.has(key1))
      return _collisions.get(key1)?.get(key2) || "bump";
    return "bump";
  }

  function executeCollisionChain(index?: number, operation?: number) {
    while (collisionChain.length != 0) {
      collisionChain.pop();
    }
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) items.delete(ac);
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
    // MAGIC UPDATE
    items = items;
  }

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];
  let playerInteracted = false;

  function handle(e: KeyboardEvent) {
    if (e.code == "Space") {
      playerInteracted = true;
      if (items.has(ac)) {
        for (let c of _conditions.values()) {
          if (c.condition()) c.event();
        }
      }
      return;
    }
    playerInteracted = false;
    if (e.code == "KeyG") {
      ghost = !ghost;
      return;
    }
    if (wasd.includes(e.code)) {
      dirKey = e.code;
      adc = ac + dirs[dirKey].operation;
      return;
    }
    if (!e.code.includes("Arrow")) return;
    let operation = calcOperation(e.code, ac);
    if (operation == 0) return;
    if (ghost || !items.has(ac)) {
      moveActiveCell(operation);
      return;
    }
    let item = items.get(ac);
    if (item == undefined || $statics.has(item.emoji)) return;
    let postOpItem = items.get(ac + operation);
    if (postOpItem != undefined) {
      switch (getCollisionType(item.emoji, postOpItem.emoji)) {
        case "push":
          // TODO: Cascade pushables
          let i = 2;
          collisionChain = [];

          while (items.get(ac + operation * i) !== undefined) {
            let _emoji = items.get(ac + operation * (i - 1))?.emoji;
            let _emoji2 = items.get(ac + operation * i)?.emoji;
            if (_emoji == undefined || _emoji2 == undefined) continue;
            collisionChain.push(getCollisionType(_emoji, _emoji2));

            i++;
          }

          if (i != 2) {
            if (collisionChain.includes(undefined)) break;
            executeCollisionChain();
            break;
          }

          items.set(ac + operation * 2, postOpItem);
          items.set(ac + operation, item);
          items = items;
          moveActiveCell(operation, true);
          break;
        case "bump":
          break;
        default:
          // MERGE
          postOpItem.emoji = getCollisionType(item.emoji, postOpItem.emoji);
          items.set(ac + operation, postOpItem);
          items = items;
          // items[ac + operation].emoji = getCollisionType(
          //   items[ac].emoji,
          //   items[ac + operation].emoji
          // );
          moveActiveCell(operation, true);
          break;
      }
    } else {
      postOpItem = {
        index: ac + operation,
        emoji: item.emoji,
      };
      items.set(ac + operation, postOpItem);
      items = items;

      moveActiveCell(operation, true);
    }
  }
</script>

<svelte:window on:keydown={handle} />

<section class="playable-map">
  <!-- TODO: Add how to play modal with kbd elements -->
  <button class="guide">❔</button>
  <section class="noselect">
    <p><strong>Objective: </strong>{_map.objective || "?"}</p>
    <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
    <div class="map">
      {#each { length: 256 } as _, i}
        {@const isControlling = !ghost && items.has(ac)}
        {@const isActive = ac == i}
        <div
          style:background={backgrounds.get(i) || ""}
          class:adc={adc == i && isControlling}
          class:active={isActive}
        >
          {#if isActive && isControlling}
            <div class="direction" style={dirs[dirKey].style}>
              {$currentItem || dirs[dirKey].emoji}
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
          <button on:click={mutations.reset}>REPLAY</button>
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

  .guide {
    position: absolute;
    top: 2%;
    right: 2%;
  }
</style>
