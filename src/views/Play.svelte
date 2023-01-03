<script lang="ts">
  import { scale } from "svelte/transition";
  import { onDestroy, onMount } from "svelte/internal";
  import {
    map,
    pushes,
    merges,
    conditions,
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
  } from "../store";

  let canvas: HTMLCanvasElement;
  let itemCanvas: HTMLCanvasElement;
  let backgroundCanvas: HTMLCanvasElement;

  let width = 540;
  let height = 540;
  let ctx: CanvasRenderingContext2D;
  let itemCtx: CanvasRenderingContext2D;
  let backgroundCtx: CanvasRenderingContext2D;

  let index = 0;
  let x = 0,
    y = 0;

  let size = 32;
  let padding = 4;
  let box = size + padding;

  onMount(() => {
    [$currentColor, $currentEmoji] = ["", ""];

    // ctx = canvas.getContext("2d");
    // ctx.font = "16px serif";

    // for (let i = 0; i < 16; i++) {
    //   for (let j = 0; j < 16; j++) {
    //     ctx.beginPath();
    //     ctx.fillStyle = "antiquewhite";
    //     ctx.fillRect(box * j, box * i, size, size);
    //     ctx.stroke();
    //   }
    // }
  });

  let fontPaddingX = -20;
  let fontPaddingY = 18;

  /**
   * Updates item layer on canvas
   *
   * == LAYERS ==
   * ui
   * items
   * background
   */
  function updateItems() {
    // TODO:
    for (let [id, emoji] of items) {
      let row = Math.floor(id / 16);
      let col = id % 16;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let x = box * col + fontPaddingX;
      let y = box * row + fontPaddingY;

      ctx.fillText(emoji, x, y);
    }
  }

  /**
   * Updates background layer on canvas
   * == LAYERS ==
   * ui
   * items
   * background
   */
  function updateBackground() {
    // TODO:
  }

  /**
   * Updates UI layer on canvas
   * == LAYERS ==
   * ui
   * items
   * background
   */
  function updateUI() {}

  function updateCanvas() {
    console.log("update");

    for (let [id, emoji] of items) {
      let row = Math.floor(id / 16);
      let col = id % 16;
      console.log(row, col);

      // col = 5;
      // row = 5;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let x = box * col + fontPaddingX;
      let y = box * row + fontPaddingY;

      ctx.fillText(emoji, x, y);

      // TODO: PAINTING
      // ctx.beginPath();
      // ctx.fillStyle = "black";
      // ctx.fillRect(box * col, box * row, size, size);
      // ctx.stroke();
    }
  }

  function calcOperation(
    _code: string,
    index: number,
    translate = false,
    opposite = false
  ) {
    let code = _code;
    if (translate) {
      switch (code) {
        case "KeyW":
          code = opposite ? "ArrowDown" : "ArrowUp";
          break;
        case "KeyA":
          code = opposite ? "ArrowRight" : "ArrowLeft";
          break;
        case "KeyS`":
          code = opposite ? "ArrowUp" : "ArrowDown";
          break;
        case "KeyD":
          code = opposite ? "ArrowLeft" : "ArrowRight";
          break;
      }
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

  /* ## DATA ## */
  let _events = new Map<number, Array<SequenceItem> | TLoopEvent>([
    ...$events,
    ...$loopEvents,
  ]);
  let _map = structuredClone($map);
  let items = new Map(_map.items);
  let backgrounds = new Map(_map.backgrounds);
  let _collisions = new Map<string, Map<string, string>>();

  let firstItemIndex = items.entries().next().value;
  ac = firstItemIndex ? firstItemIndex[0] : -2;
  adc = ac + 1;

  let controllables = [];
  for (let c of _map.items.values()) {
    if (!$statics.has(c)) controllables.push(c);
  }

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

  interface _Condition {
    condition: Function;
    event: Function;
  }

  class _Condition {
    constructor(
      a: Function,
      b: string,
      sequence: Array<SequenceItem>,
      loop?: Loop
    ) {
      this.condition = () => a() == b;
      this.event = async (_start?: number) => {
        for (let { type, ...args } of sequence) {
          if (type == "wait") {
            await m["wait"](args.duration);
          } else {
            m[type](args, _start);
          }
        }

        if (loop) {
          if (_start != undefined) {
            if (_start >= loop.end) return;
            if (loop.timeGap != 0) {
              await m["wait"](loop.timeGap);
            }
            let sign = loop.iterationType == "increment" ? 1 : -1;
            this.event(_start + loop.iterationNumber * sign);
          } else {
            this.event(loop.start);
          }
        }
      };
    }
  }

  let _conditions = new Map<number, _Condition>();

  for (let [id, condition] of $conditions.entries()) {
    let event = _events.get(condition.eventID);
    if (event == undefined) continue;
    if ($palette.size == 0) {
      if (Array.isArray(event)) {
        event = event.filter((s) => s.type != "setBackgroundOf");
        if (event.length == 0) continue;
      } else {
        event.sequence = event.sequence.filter(
          (s) => s.type != "setBackgroundOf"
        );
        if (event.sequence.length == 0) continue;
      }
    }

    let a = () => {};
    let b = condition.b;

    if (condition.a == "playerBackground") {
      a = () => backgrounds.get(ac);
    } else if (condition.a == "playerInteractsWith") {
      a = () => {
        return items.get(adc) || "";
      };
    }

    if (Array.isArray(event)) {
      _conditions.set(id, new _Condition(a, b, event));
    } else {
      _conditions.set(id, new _Condition(a, b, event.sequence, event.loop));
    }
  }

  // Possible optimizations
  // trigger once option (_conditions.delete(id) after event is fired);
  // switch to canvas

  function getCollisionType(key1: string, key2: string): string {
    if (_collisions.has(key1)) {
      return _collisions.get(key1)?.get(key2) || "bump";
    }
    return "bump";
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
    }
    ac += operation;
    adc = ac + dirs[dirKey].operation;
    if (items.has(ac)) {
      for (let c of _conditions.values()) {
        if (c.condition()) c.event();
      }
    }

    // MAGIC UPDATE, NECESSARY FOR REACTIVITY
    items = items;
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
      case 16:
        code = "ArrowDown";
        break;
      case -16:
        code = "ArrowUp";
        break;
    }

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
  let playerInteracted = false;

  function handle(e: KeyboardEvent) {
    e.preventDefault();
    if (e.code.includes("Arrow")) {
      let operation = calcOperation(e.code, ac);
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
      dirKey = e.code;
      adc = ac + dirs[dirKey].operation;
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
        adc = ac + dirs[dirKey].operation;
      } else {
        ac = closestID;
        adc = ac + dirs[dirKey].operation;
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
        adc = ac + dirs[dirKey].operation;
      } else {
        ac = closestID;
        adc = ac + dirs[dirKey].operation;
      }
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
      let timer = setTimeout(() => (playerInteracted = false), 100);
      timeouts.push(timer);
      return;
    }
  }
</script>

<svelte:window on:keydown={handle} />

<!-- <div class="map shadow-2xl">
  {#each { length: 256 } as _, i}
    {@const active = ac == i}
    <div
      class="cell"
      style:background={backgrounds.get(i) || $map.dbg}
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
  {#if levelCompleted}
    <dialog open bind:this={dialog} transition:scale>
      LEVEL COMPLETED!
      <button on:click={() => (levelCompleted = !levelCompleted)}>OK</button>
      <button on:click={() => m.resetLevel()}>REPLAY</button>
    </dialog>
  {/if}
</div> -->

<main class="relative flex h-full w-full flex-col items-center justify-center">
  <canvas id="ui" bind:this={canvas} {width} {height} on:click={updateCanvas} />
  <canvas id="items" bind:this={itemCanvas} {width} {height} />
  <canvas id="background" bind:this={backgroundCanvas} {width} {height} />
</main>

<style>
  main {
    position: relative;
  }

  canvas {
    position: absolute;
    background-color: transparent;
    padding: 4px;
  }

  #ui {
    z-index: 3;
  }

  #items {
    z-index: 2;
  }

  #background {
    z-index: 1;
  }
</style>
