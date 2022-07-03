<script lang="ts">
  import { onMount } from "svelte";
  import type { Emoji } from "../store";
  import { editableMap } from "../store";

  function canMove(keyCode: number, index: number) {
    if (keyCode == 37 && index % 16 == 0) return 0;
    if (keyCode == 38 && index < 16) return 0;
    if (keyCode == 39 && (index + 1) % 16 == 0) return 0;
    if (keyCode == 40 && index >= 240) return 0;
    return (keyCode % 2 == 0 ? 16 : 1) * (keyCode >= 39 ? 1 : -1);
  }

  interface Items {
    [id: number]: Emoji;
  }

  // ACTIVE CELL
  let ac = 0;
  let items: Items = {};
  let ghost = true;

  let arrowKeys = [37, 38, 39, 40];
  function handle(e: KeyboardEvent) {
    if (e.keyCode == 32) ghost = !ghost;
    if (!arrowKeys.includes(e.keyCode)) return;
    let operation = canMove(e.keyCode, ac);
    if (ghost) {
      ac += operation;
      return;
    }
    if (items[ac] == undefined) return;
    if (operation == 0) return;
    let { emoji, behavior } = items[ac];
    if (items[ac + operation] !== undefined) {
      // TODO: Collision
      console.log("collision");

      let behaviorKey = items[ac + operation].emoji;
      let collisionType = items[ac].behavior[behaviorKey];
      switch (collisionType) {
        case "push":
          // TODO: If there is wall or bumpable, return
          // TODO: Cascade pushables
          items[ac + operation * 2] = items[ac + operation];
          items[ac + operation] = items[ac];
          delete items[ac];

          console.log("push");
          break;
        default:
          // TODO: update behavior
          items[ac + operation].emoji = collisionType;
          delete items[ac];
          break;
      }
    }
    items[ac + operation] = {
      index: ac + operation,
      emoji,
      behavior,
    };

    delete items[ac];
    ac += operation;
  }

  onMount(() => {
    items = $editableMap.items;
    console.log(items);
  });
</script>

<svelte:window on:keydown={handle} />

<section class="noselect">
  <p title="ghost mode {ghost ? 'on' : 'off'}">👻 {ghost ? "✔️" : "❌"}</p>
  <div class="map">
    {#each { length: 256 } as _, i}
      <div class:active={ac == i}>
        {items[i]?.emoji || ""}
        <!-- {"🌴"} -->
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
