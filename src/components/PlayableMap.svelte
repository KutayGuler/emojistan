<script lang="ts">
  import type { Emoji, Condition } from "../store";
  import { onMount } from "svelte/internal";
  import {
    editableMap as map,
    collisions,
    conditions,
    events,
    staticItems,
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
  Object.values($collisions).forEach((rule) => {
    let [key1, key2, val] = rule.split(",");
    if (behaviors[key1] == undefined) behaviors[key1] = {};
    behaviors[key1][key2] = val;
  });

  const mutations = {
    setPlayer: ({ index, emoji }: Emoji) => {
      if (items[ac]) {
        items[ac].emoji = emoji;
      } else {
        items[ac] = { index: ac, emoji };
      }
    },
    // @ts-ignore
    setBackgroundOf: ({ index, background }) => {
      backgrounds[index] = background;
    },
    spawn: ({ index, emoji }: Emoji) => {
      items[index] = { index, emoji };
    },
    // @ts-ignore
    wait: async ({ duration }) => {
      setTimeout(() => {}, duration);
    },
    reset: () => {
      backgrounds = structuredClone(_map.backgrounds);
      items = structuredClone(_map.items);
    },
  };

  interface _Conditions {
    [id: number]: any;
  }

  let _conditions: _Conditions = {};

  Object.entries($conditions).forEach(([id, condition]) => {
    let a: any;
    let b: any = condition.b;
    switch (condition.a) {
      case "playerBackground":
        a = () => backgrounds[ac];
        break;
    }

    let eventQueue: Array<Function> = [];

    // @ts-ignore
    _events[condition.eventID].queue.forEach(({ type, ...args }) => {
      // @ts-ignore
      console.log(args);
      if (type == "wait") {
        // @ts-ignore
        eventQueue.push(async () => await mutations[type](args));
      } else {
        // @ts-ignore
        eventQueue.push(() => mutations[type](args));
      }
    });

    console.log(eventQueue);

    if (condition.once) {
      eventQueue.push(() => (eventQueue = []));
    }

    // TODO: might use generators

    _conditions[+id] = {};
    _conditions[+id].condition = () => a() == b;
    _conditions[+id].event = () => {
      for (let event of eventQueue) {
        event();
      }
    };
  });

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
    // @ts-ignore
    r.style.setProperty(
      "--inverted",
      invertColor(backgrounds[ac] || defaultBackground)
    );
    Object.values(_conditions).forEach((c) => {
      if (c.condition()) c.event();
    });
  }

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];

  function handle(e: KeyboardEvent) {
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
    if ($staticItems.includes(items[ac].emoji)) return;
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
          // @ts-ignore
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
  <p><strong>Objective: </strong>{_map.objective}</p>
  <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
  <div class="map">
    {#each { length: 256 } as _, i}
      <div
        style:background={backgrounds[i]}
        class:adc={adc == i}
        class:active={ac == i}
      >
        {#if ac == i}
          <div class="direction" style={dirs[dirKey].style}>
            {dirs[dirKey].emoji}
          </div>
        {/if}
        {items[i]?.emoji || ""}
      </div>
    {/each}
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
