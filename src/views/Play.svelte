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
  import { SIZE } from "$src/constants";

  onMount(() => {
    [$currentColor, $currentEmoji] = ["", ""];
  });

  console.log($events, $conditions);

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

  let levelCompleted = false;
  let ac: number; // ACTIVE CELL
  let adc: number; // ADJACENT CELL
  let dirs: {
    [key: string]: { style: string; emoji: string; operation: number };
  } = {
    KeyW: { style: `top: -50%;`, emoji: "⬆️", operation: -SIZE },
    KeyA: { style: `left: -50%;`, emoji: "⬅️", operation: -1 },
    KeyS: { style: `bottom: -50%;`, emoji: "⬇️", operation: SIZE },
    KeyD: { style: `right: -50%;`, emoji: "➡️", operation: 1 },
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

  let t = 0;

  // TODO: there should also be checkCollision
  // TODO: loop should cancel if there is a collision

  function checkCollision(currentIndex: number, nextIndex: number) {}

  // MUTATIONS
  const m: Mutations = {
    setBackgroundOf: ({ index, background }, _start?) => {
      backgrounds.set(_start || index, background);
      backgrounds = backgrounds;
      if (ac == _start || ac == index) {
        checkCondition();
      }
    },
    removeBackgroundOf: ({ index }) => {
      backgrounds.delete(index);
    },
    trailBackground: ({ index, background, iterationNumber }, _start?) => {
      let _t = Date.now();
      // console.log(_t - t);
      // console.trace();
      // window.performance.now
      if (t == 0) {
        t = _t;
      } else if (_t - t < 10) {
        console.log(_t - t);

        console.log("too fast");
      }

      t = _t;

      if (_start) backgrounds.delete(_start + iterationNumber * -1);
      backgrounds.set(_start || index, background);
      backgrounds = backgrounds;
      if (ac == _start || ac == index) {
        checkCondition();
      }
    },
    spawn: ({ index, emoji }, _start?) => {
      items.set(_start || index, emoji);
      items = items;
    },
    destroy: ({ index }) => {
      items.delete(index);
    },
    trail: ({ index, emoji, iterationNumber }, _start?) => {
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
          if (type.includes("trail")) {
            // @ts-expect-error
            args.iterationNumber = loop?.iterationNumber;
          }

          if (type == "wait") {
            await m.wait(args.duration);
          } else {
            // @ts-expect-error
            m[type](args, _start);
          }
        }

        if (loop) {
          if (loop.timeGap != 0) {
            await m["wait"](loop.timeGap);
          }

          if (_start != undefined) {
            if (_start >= loop.end - 1) return;
            let sign = loop.iterationType == "increment" ? 1 : -1;
            this.event(_start + loop.iterationNumber * sign);
          } else {
            this.event(loop.start);
          }
        } else {
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

  function getCollisionType(key1: string, key2: string): string {
    if (_collisions.has(key1)) {
      return _collisions.get(key1)?.get(key2) || "bump";
    }
    return "bump";
  }

  function checkCondition() {
    // if prevAc == ac &&
    if (items.has(ac)) {
      for (let c of _conditions.values()) {
        if (c.condition()) c.event();
      }
    }

    // MAGIC UPDATE, NECESSARY FOR REACTIVITY
    items = items;
  }

  function moveActiveCell(operation: number, _delete?: boolean) {
    if (_delete) {
      items.delete(ac);
    }
    ac += operation;
    adc = ac + dirs[dirKey].operation;
    checkCondition();
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

<div class="map">
  {#each { length: SIZE * SIZE } as _, i}
    {@const active = ac == i}
    <div
      class="cell"
      style:background={backgrounds.get(i) || $map.dbg}
      class:active
    >
      {#if active && calcOperation(dirKey, i, true) != 0}
        <div class="direction scale-75" style={dirs[dirKey].style}>
          {dirs[dirKey].emoji}
        </div>
      {/if}
      <span style="transform: rotate(45deg);">
        {items.get(i) || ""}
      </span>
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
