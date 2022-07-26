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

  interface Items {
    [id: number]: Emoji;
  }

  interface Behaviors {
    [emoji: string]: {
      [emoji: string]: string;
    };
  }

  interface Dirs {
    [key: string]: {
      style: string;
      emoji: string;
      operation: number;
    };
  }

  /* ## STATE ## */
  let dialog: HTMLDialogElement;
  let interact = false;
  let levelCompleted = false;
  let ac = 0; // ACTIVE CELL
  let adc = 1; // ADJACENT CELL
  let ghost = true;
  let collisionChain: Array<any> = [];
  let dirs: Dirs = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -16 },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: 16 },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };
  let dirKey = "KeyD";

  /* ## DATA ## */
  let _events = structuredClone($events);
  let _map = structuredClone($map);
  let items: Items = structuredClone(_map.items);
  let backgrounds = structuredClone(_map.backgrounds);
  let behaviors: Behaviors = {};

  for (let rule of Object.values($collisions)) {
    let [key1, key2, val] = rule.split(",");
    if (behaviors[key1] == undefined) {
      behaviors[key1] = {};
    }
    behaviors[key1][key2] = val;

    // making emoji merge both ways
    if (/\p{Extended_Pictographic}/gu.test(val)) {
      if (key1 != key2) {
        if (behaviors[key2] == undefined) {
          behaviors[key2] = {};
        }
        behaviors[key2][key1] = val;
      }
    }
  }

  const mutations = {
    // @ts-expect-error
    setBackgroundOf: ({ index, background }, _start?: number) => {
      backgrounds[_start || index] = background;
    },
    spawn: ({ index, emoji }: Emoji) => {
      items[index] = { index, emoji };
    },
    // @ts-expect-error
    wait: async ({ duration }) => {
      return new Promise((resolve: Function) => {
        setTimeout(resolve, duration);
      });
    },
    reset: () => {
      backgrounds = structuredClone(_map.backgrounds);
      items = structuredClone(_map.items);
      ac = 0;
      adc = 1;
      dirKey = "KeyD";
      levelCompleted = false;
      ghost = true;
    },
    completeLevel: () => (levelCompleted = true),
  };

  interface _Conditions {
    [id: number]: {
      condition: Function;
      event: Function;
    };
  }

  let _conditions: _Conditions = {};

  for (let [id, condition] of Object.entries($conditions)) {
    let a: Function;
    let b: string = condition.b;
    switch (condition.a) {
      case "playerBackground":
        a = () => backgrounds[ac];
        break;
    }

    let eventQueue: Array<Function> = [];

    console.log(condition.eventID);
    let event = _events[condition.eventID];
    let queue = event.queue;

    let loop = structuredClone(event.loop);
    let start: number, end: number, op: number;
    if (loop != undefined) {
      start = loop.start;
      end = loop.end;
      op = loop.iterationNumber * (loop.iterationType == "increment" ? 1 : -1);
    }

    for (let { type, ...args } of queue) {
      if (type == "wait") {
        // @ts-expect-error
        eventQueue.push(async () => await mutations[type](args));
      } else {
        // @ts-expect-error
        eventQueue.push((_start?) => mutations[type](args, _start));
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
      if (i + 1 == eventQueue.length) {
        if (_events[condition.eventID].loop == undefined) return;
        start += op;
        if (start == end) {
          // @ts-expect-error
          start = loop.start;
          return;
        }
        execute(0, start);
      } else {
        execute(i + 1);
      }
    }

    _conditions[+id] = {
      condition: () => a() == b,
      event: () => {
        if (eventQueue.length == 0) return;
        execute(0);
      },
    };
  }

  function getCollisionType(key1: string, key2: string): string | undefined {
    if (behaviors[key1] !== undefined) return behaviors[key1][key2];
    return undefined;
  }

  function executeCollisionChain(index?: number, operation?: number) {
    while (collisionChain.length != 0) {
      console.log(collisionChain);
      collisionChain.pop();
    }
    console.log(collisionChain);
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) delete items[ac];
    ac += operation;
    adc = ac + dirs[dirKey].operation;
    r.style.setProperty(
      "--inverted",
      invertColor(backgrounds[ac] || defaultBackground)
    );
    if (items[ac] != undefined) {
      for (let c of Object.values(_conditions)) {
        if (c.condition()) c.event();
      }
    }
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
    if (ghost || items[ac] == undefined) {
      moveActiveCell(operation);
      return;
    }
    if ($statics.includes(items[ac].emoji)) return;
    if (items[ac + operation] !== undefined) {
      switch (getCollisionType(items[ac].emoji, items[ac + operation].emoji)) {
        case "push":
          // TODO: Cascade pushables
          let i = 2;
          collisionChain = [];

          while (items[ac + operation * i] !== undefined) {
            let _emoji = items[ac + operation * (i - 1)].emoji;
            let _emoji2 = items[ac + operation * i]?.emoji;
            collisionChain.push(getCollisionType(_emoji, _emoji2));
            console.log(collisionChain);
            i++;
          }

          if (i != 2) {
            if (collisionChain.includes(undefined)) return;
            executeCollisionChain();
            return;
          }

          items[ac + operation * 2] = items[ac + operation];
          items[ac + operation] = items[ac];
          moveActiveCell(operation, true);
          return;
        case "bump":
        case undefined:
          return;
        case "equip": // TODO: equip item
        // could be in conditions rather than collisions
        // each emoji should have it's own inventory
        default:
          // MERGE
          // @ts-expect-error
          items[ac + operation].emoji = getCollisionType(
            items[ac].emoji,
            items[ac + operation].emoji
          );
          moveActiveCell(operation, true);
          return;
      }
    }

    items[ac + operation] = {
      index: ac + operation,
      emoji: items[ac].emoji,
    };

    moveActiveCell(operation, true);
  }
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <button on:click={() => (levelCompleted = !levelCompleted)}>TEST</button>
  <p><strong>Objective: </strong>{_map.objective || "❓"}</p>
  <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
  <div class="map">
    {#each { length: 256 } as _, i}
      {@const isControlling = !ghost && items[ac] != undefined}
      {@const isActive = ac == i}
      <div
        style:background-color={backgrounds[i] || ""}
        class:adc={adc == i && isControlling}
        class:active={isActive}
      >
        {#if isActive && isControlling}
          <div class="direction" style={dirs[dirKey].style}>
            {interact ? "⚔️" : dirs[dirKey].emoji}
          </div>
        {/if}
        {items[i]?.emoji || ""}
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
