<script lang="ts">
  import { onMount } from "svelte";
  import type { Emoji } from "../store";
  import { editableMap, events } from "../store";

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

  let arrowKeys = [37, 38, 39, 40];

  onMount(() => {
    items = JSON.parse(JSON.stringify($editableMap.items));
    Object.values($events.collisions).forEach((rule) => {
      let [key1, key2, val] = rule.split(",");
      if (behaviors[key1] == undefined) behaviors[key1] = {};
      behaviors[key1][key2] = val;
    });
    console.log(items);
    console.log(behaviors);
  });

  function handle(e: KeyboardEvent) {
    if (e.keyCode == 32) ghost = !ghost;
    if (!arrowKeys.includes(e.keyCode)) return;
    let operation = calcOperation(e.keyCode, ac);
    if (operation == 0) return;
    if (ghost || items[ac] == undefined) {
      ac += operation;
      return;
    }
    let { emoji } = items[ac];
    if (items[ac + operation] !== undefined) {
      let key1 = items[ac].emoji;
      let key2 = items[ac + operation].emoji;
      let collisionType =
        behaviors[key1] == undefined ? undefined : behaviors[key1][key2];
      console.log(collisionType);
      switch (collisionType) {
        case "push":
          // TODO: Cascade pushables
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
          items[ac + operation].emoji = collisionType;
          delete items[ac];
          ac += operation;
          return;
      }
    }

    items[ac + operation] = {
      index: ac + operation,
      emoji,
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
      <div class:active={ac == i}>
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
