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
    interactables,
  } from "../store";
  import { invertColor } from "../invertColor";

  let r: any;
  let defaultBackground = "";

  onMount(() => {
    r = document.querySelector(":root");
    defaultBackground = r.style.getPropertyValue("--default-background");
    if (defaultBackground == "") defaultBackground = "#faebd7";
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
  let interact = false;
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
  let behaviors = new Map<string, Map<string, string>>();

  for (let rule of $collisions.values()) {
    let [key1, key2, val] = rule.split(",");
    if (!behaviors.has(key1)) {
      behaviors.set(key1, new Map());
    }
    behaviors.get(key1)?.set(key2, val);

    // making emoji merge both ways
    if (/\p{Extended_Pictographic}/gu.test(val)) {
      if (key1 != key2) {
        if (!behaviors.has(key2)) {
          behaviors.set(key2, new Map());
        }
        behaviors.get(key2)?.set(key1, val);
      }
    }
  }

  const mutations = {
    setBackgroundOf: (
      { index, background }: { index: number; background: string },
      _start?: number
    ) => {
      backgrounds.set(_start || index, background);
    },
    spawn: ({ index, emoji }: Emoji) => {
      items.set(index, { index, emoji });
    },
    destroy: ({ index }: { index: number }) => {
      items.delete(index);
    },
    wait: async (duration: number) => {
      return new Promise((resolve: Function) => {
        setTimeout(resolve, duration);
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

  for (let [id, condition] of $conditions.entries()) {
    let a: Function;
    let b: string = condition.b;
    switch (condition.a) {
      case "playerBackground":
        a = () => backgrounds.get(ac);
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
          await new Promise((resolve) => setTimeout(resolve, duration))
      );
    } else if (condition.once) {
      eventQueue.push(() => (eventQueue = []));
    }

    async function execute(i: number, _start?: number) {
      console.log("execute");
      console.log(eventQueue[i]);
      await eventQueue[i](_start);
      // MAGIC UPDATE
      backgrounds = backgrounds;
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
      condition: () => a() == b,
      event: () => {
        if (eventQueue.length == 0) return;
        execute(0);
      },
    });
  }

  function getCollisionType(key1: string, key2: string): string {
    if (behaviors.has(key1)) return behaviors.get(key1)?.get(key2) || "bump";
    return "bump";
  }

  function executeCollisionChain(index?: number, operation?: number) {
    while (collisionChain.length != 0) {
      console.log(collisionChain);
      collisionChain.pop();
    }
    console.log(collisionChain);
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

  function handle(e: KeyboardEvent) {
    if (ac == 3) interact = true;
    if (e.code == "Space") ghost = !ghost;
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
    if (item == undefined || $statics.includes(item.emoji)) return;
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
            console.log(collisionChain);
            i++;
          }

          if (i != 2) {
            if (collisionChain.includes(undefined)) break;
            executeCollisionChain();
            break;
          }

          items.set(ac + operation * 2, postOpItem);
          items.set(ac + operation, item);
          moveActiveCell(operation, true);
          break;
        case "bump":
          break;
        case "equip": // TODO: equip item
        // could be in conditions rather than collisions
        // each emoji should have it's own inventory
        default:
          // MERGE
          postOpItem.emoji = getCollisionType(item.emoji, postOpItem.emoji);
          items.set(ac + operation, postOpItem);
          // items[ac + operation].emoji = getCollisionType(
          //   items[ac].emoji,
          //   items[ac + operation].emoji
          // );
          moveActiveCell(operation, true);
          break;
      }
    } else {
      console.log("else");
      postOpItem = {
        index: ac + operation,
        emoji: item.emoji,
      };
      items.set(ac + operation, postOpItem);
      console.log(items);

      moveActiveCell(operation, true);
    }
  }
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <button on:click={() => (levelCompleted = !levelCompleted)}
    >SHOW DIALOG</button
  >
  <p><strong>Objective: </strong>{_map.objective || "❓"}</p>
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
            {interact ? "⚔️" : dirs[dirKey].emoji}
          </div>
        {/if}
        {items.get(i)?.emoji || ""}
      </div>
    {/each}
    {#if levelCompleted}
      <dialog open bind:this={dialog} transition:scale>
        LEVEL COMPLETED!
        <button on:click={() => (levelCompleted = !levelCompleted)}>OK</button>
        <button on:click={mutations.reset}>REPLAY</button>
      </dialog>
    {/if}
  </div>
</section>

<style>
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
</style>
