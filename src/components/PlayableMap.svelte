<script lang="ts">
  import type { Emoji } from "../store";
  import { onMount } from "svelte/internal";
  import { editableMap as map, events, staticItems } from "../store";
  import { invertColor } from "../invertColor";

  let r: any;
  let defaultBackground = "";

  onMount(() => {
    r = document.querySelector(":root");
    defaultBackground = r.style.getPropertyValue("--default-background");
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

  /* ## STATE ## */
  let ac = 0; // ACTIVE CELL
  let ghost = true;
  let collisionChain: Array<any> = [];

  /* ## DATA ## */
  const _map = JSON.parse(JSON.stringify($map));
  let items: Items = _map.items;
  let backgrounds = _map.backgrounds;
  let objective = _map.objective;
  let behaviors: Behaviors = {};
  Object.values($events.collisions).forEach((rule) => {
    let [key1, key2, val] = rule.split(",");
    if (behaviors[key1] == undefined) behaviors[key1] = {};
    behaviors[key1][key2] = val;
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
    // @ts-ignore
    r.style.setProperty(
      "--inverted",
      invertColor(backgrounds[ac] || defaultBackground)
    );
  }

  function handle(e: KeyboardEvent) {
    if (e.code == "Space") ghost = !ghost;
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
  <p><strong>Objective: </strong>{objective}</p>
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
    outline: 2px solid var(--inverted);
  }
</style>
