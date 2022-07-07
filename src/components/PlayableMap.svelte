<script lang="ts">
  import { onMount } from "svelte";
  import type { Emoji } from "../store";
  import { editableMap as map, events } from "../store";

  function calcOperation(keyCode: number, index: number) {
    if (keyCode == 37 && index % 16 == 0) return 0;
    if (keyCode == 38 && index < 16) return 0;
    if (keyCode == 39 && (index + 1) % 16 == 0) return 0;
    if (keyCode == 40 && index >= 240) return 0;
    return (keyCode % 2 == 0 ? 16 : 1) * (keyCode >= 39 ? 1 : -1);
  }

  interface Items {
    [id: number]: Emoji;
  }

  interface Behaviors {
    [emoji: string]: {
      [emoji: string]: string;
    };
  }

  // ACTIVE CELL
  let ac = 0;
  let items: Items = {};
  let behaviors: Behaviors = {};
  let ghost = true;
  let collisionChain: Array<any> = [];

  let arrowKeys = [37, 38, 39, 40];

  onMount(() => {
    items = JSON.parse(JSON.stringify($map.items));
    Object.values($events.collisions).forEach((rule) => {
      let [key1, key2, val] = rule.split(",");
      if (behaviors[key1] == undefined) behaviors[key1] = {};
      behaviors[key1][key2] = val;
    });
    console.log(items);
    console.log(behaviors);
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

  function handle(e: KeyboardEvent) {
    if (e.keyCode == 32) ghost = !ghost;
    if (!arrowKeys.includes(e.keyCode)) return;
    let operation = calcOperation(e.keyCode, ac);
    if (operation == 0) return;
    if (ghost || items[ac] == undefined) {
      ac += operation;
      return;
    }
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
          delete items[ac];
          ac += operation;
          return;
        case "bump":
        case undefined:
          return;
        default:
          // MERGE
          // @ts-ignore
          items[ac + operation].emoji = getCollisionType(
            items[ac].emoji,
            items[ac + operation].emoji
          );
          delete items[ac];
          ac += operation;
          return;
      }
    }

    items[ac + operation] = {
      index: ac + operation,
      emoji: items[ac].emoji,
    };

    delete items[ac];
    ac += operation;
  }
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
  <div class="map">
    {#each { length: 256 } as _, i}
      <div style:background={$map.backgrounds[i]} class:active={ac == i}>
        {items[i]?.emoji || ""}
      </div>
    {/each}
  </div>
</section>

<style>
  :root {
    --cell-size: 4vw;
    --cell: 3.8vw;
    --cell-gap: calc(var(--cell-size) - var(--cell));
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .active {
    border: 1px solid red;
  }
</style>
