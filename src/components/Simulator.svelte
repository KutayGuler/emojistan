<script lang="ts">
  import { onDestroy } from "svelte/internal";
  import type { A, Mutations, SequenceItem } from "../store";

  interface Condition {
    a: A;
    b: string;
  }

  export let mutation: SequenceItem = {
    type: "setBackgroundOf",
    index: 5,
    background: "#ffffff",
  };
  export let items: Map<number, string>;
  export let statics = new Set<string>();
  export let condition: Condition = { a: "playerBackground", b: "#ff00ff" };
  export let collisions = new Map<string, Map<string, string>>();
  export let backgrounds = new Map<number, string>();

  backgrounds.set(2, "#ff00ff");
  // MUTATIONS
  // @ts-expect-error
  const m: Mutations = {
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
    spawn: (
      { index, emoji }: { index: number; emoji: string },
      _start?: number
    ) => {
      items.set(_start || index, emoji);
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
    // resetLevel: () => {
    //   backgrounds = new Map(_map.backgrounds);
    //   items = new Map(_map.items);
    //   ac = items.entries().next().value[0];
    //   adc = ac + 1;
    //   dirKey = "KeyD";
    //   levelCompleted = false;
    // },
    // completeLevel: () => (levelCompleted = true),
  };

  let ac: number;
  let adc: number;

  let firstItemIndex = items.entries().next().value;
  ac = firstItemIndex ? firstItemIndex[0] : -2;
  adc = ac + 1;

  let wasd = ["KeyW", "KeyA", "KeyS", "KeyD"];
  let playerInteracted = false;

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

  let dirs: {
    [key: string]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -30%;`, emoji: "⬆️", operation: -4 },
    KeyA: { style: `left: -30%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -30%;`, emoji: "⬇️", operation: 4 },
    KeyD: { style: `right: -30%;`, emoji: "➡️", operation: 1 },
  };
  let dirKey = "KeyD";

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
    }
    ac += operation;
    adc = ac + dirs[dirKey].operation;
    if (items.has(ac)) {
      if (condition.a == "playerBackground") {
        if (backgrounds.get(ac) == condition.b) {
          let { type, ...args } = mutation;
          m[type](args);
        }
      }
    }

    // MAGIC UPDATE, NECESSARY FOR REACTIVITY
    items = items;
  }

  function getCollisionType(key1: string, key2: string): string {
    if (collisions.has(key1)) {
      return collisions.get(key1)?.get(key2) || "bump";
    }
    return "bump";
  }

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
    if (code == "ArrowLeft" && index % 4 == 0) return 0;
    if (code == "ArrowUp" && index < 4) return 0;
    if (code == "ArrowRight" && (index + 1) % 4 == 0) return 0;
    if (code == "ArrowDown" && index >= 12) return 0;
    return (
      (["ArrowUp", "ArrowDown"].includes(code) ? 4 : 1) *
      (["ArrowRight", "ArrowDown"].includes(code) ? 1 : -1)
    );
  }

  function handle(e: KeyboardEvent) {
    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code, ac);
      if (!items.has(ac)) {
        moveActiveCell(operation);
        return;
      }
      let item = items.get(ac);
      if (item == undefined || statics.has(item)) return;
      let postOpItem = items.get(ac + operation);
      if (postOpItem) {
        switch (getCollisionType(item, postOpItem)) {
          case "push":
            let collisionChain = [];
            let i = 1;
            while (items.get(ac + operation * i)) {
              collisionChain.push(items.get(ac + operation * i));
              i++;
            }

            let arr = [];
            for (let i = 0; i < collisionChain.length; i++) {
              let cur = collisionChain[i];
              let next = collisionChain[i + 1];
              if (cur && next) {
                arr.push(collisions.get(cur)?.get(next));
              }
            }

            let finalIndex = ac + operation * (i - 1);
            let code = "";

            if (operation == 1) code = "ArrowRight";
            if (operation == -1) code = "ArrowLeft";
            if (operation == 4) code = "ArrowDown";
            if (operation == -4) code = "ArrowUp";

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
                let cur = collisionChain[i];
                let next = collisionChain[i + 1];
                if (next && cur) {
                  let emoji = collisions.get(cur)?.get(next);
                  if (emoji && emoji != "push") {
                    items.set(ac + operation * (i + 2), emoji);
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
            break;
          case "bump":
            break;
          default:
            // MERGE
            postOpItem = getCollisionType(item, postOpItem);
            moveActiveCell(operation, true);
            break;
        }
      } else {
        if (item) {
          items.set(ac + operation, item);
        } else {
          items.set(ac + operation, item);
        }
        moveActiveCell(operation, true);
      }
    }

    if (wasd.includes(e.code)) {
      dirKey = e.code;
      adc = ac + dirs[dirKey].operation;
      return;
    }

    if (e.code == "Space") {
      if (calcOperation(dirKey, adc, true, true) == 0) {
        playerInteracted = false;
        return;
      }

      playerInteracted = true;
      if (items.has(ac) && condition.a == "playerBackground") {
        if (backgrounds.get(ac) == condition.b) {
          let { type, ...args } = mutation;
          m[type](args);
        }
      }
      let timer = setTimeout(() => (playerInteracted = false), 100);
      timeouts.push(timer);
      return;
    }
  }
</script>

<svelte:window on:keydown={handle} />

<div class="shadow-xl; grid w-auto grid-cols-4 grid-rows-4 gap-1 p-1">
  {#each { length: 16 } as _, i}
    {@const active = ac == i}
    <div
      class="cell"
      style:background={backgrounds.get(i) || "var(--default-background)"}
      class:active
    >
      {#if active && calcOperation(dirKey, i, true) != 0}
        <div class="direction" style={dirs[dirKey].style}>
          {dirs[dirKey].emoji}
        </div>
      {/if}
      {items.get(i) || ""}
    </div>
  {/each}
</div>
