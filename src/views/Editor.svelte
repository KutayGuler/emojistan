<script lang="ts">
  import { onMount } from "svelte";
  import {
    currentEmoji,
    currentColor,
    map,
    modal,
    saves,
    palette,
  } from "../store";
  import { longpress } from "../utils/longpress";

  onMount(() => {
    if ($saves.current == "") {
      saves.useStorage();
    }
    map.useStorage($saves.current);
  });

  let showIndex = false;
  let deleteMode = "Both";

  function pickColor(color: string) {
    console.log(color);
    $currentColor = color == $currentColor ? "" : color;
  }

  function clickedCell(index: number) {
    if ($currentColor == "" && $currentEmoji == "") {
      switch (deleteMode) {
        case "Item":
          map.removeEmoji(index);
          break;
        case "Background":
          map.deleteBackground(index);
          break;
        default:
        case "Both":
          map.removeEmoji(index);
          map.deleteBackground(index);
          break;
      }
      return;
    }

    if ($currentColor != "") {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji != "") {
      // db.saves.update();
      map.addEmoji(index, {
        emoji: $currentEmoji,
      });
    }
  }
</script>

<section class="flex h-[90vh] w-full flex-row items-start justify-center gap-2">
  <!-- <p
    class="absolute top-8 right-8 cursor-help text-3xl duration-200 ease-out hover:scale-150"
    on:click={() => modal.show("keyboardEditor")}
  >
    ⌨️
  </p> -->
  <section class="relative flex flex-row gap-4">
    <div class="flex flex-col items-center justify-start gap-2">
      {#each [...$palette] as c}
        <div
          class="color"
          class:currentColor={c == $currentColor}
          style:background={c}
          on:click={() => pickColor(c)}
        />
      {/each}
    </div>
    <div class="map">
      {#each { length: 256 } as _, i}
        <div
          class="cell"
          style:background={$map.backgrounds.get(i) ||
            "var(--default-background)"}
          on:click={() => clickedCell(i)}
        >
          {$map?.items.get(i)?.emoji || (showIndex ? i : "")}
        </div>
      {/each}
    </div>
    <div class="flex flex-col">
      <!-- <textarea name="" id="" cols="30" rows="10"></textarea> -->
      <textarea
        class="min-h-40 max-h-96 w-full"
        type="text"
        placeholder="Objective"
        bind:value={$map.objective}
      />
      <span class="w-auto">
        <input type="checkbox" bind:checked={showIndex} />🔢
      </span>
      <div>
        Delete Mode:
        <div class="flex flex-col">
          {#each ["Item", "Background", "Both"] as mode}
            <label>
              <input
                type="radio"
                bind:group={deleteMode}
                name="delete-mode"
                value={mode}
              />
              {mode}
            </label>
          {/each}
        </div>
        Clear:
        <div class="clear flex flex-col">
          <button use:longpress on:longpress={map.clearObjects}> Items </button>
          <button use:longpress on:longpress={map.clearBackgrounds}>
            Backgrounds
          </button>
          <button use:longpress on:longpress={map.clearAll}> All </button>
        </div>
      </div>
    </div>
  </section>
</section>

<style>
  :root {
    --transition: 500ms;
  }

  .clear > button {
    border-radius: 3px;
    text-decoration: none;
    position: relative;
    border: 1px solid var(--primary);
    z-index: 2;
    width: 7vw;
    transition: var(--transition);
    border-color: var(--danger);
    color: var(--danger);
  }

  label,
  .clear > button {
    cursor: pointer;
  }

  .clear > button:active {
    color: var(--primary);
  }

  .clear > button::before,
  .clear > button::after {
    background: var(--danger);
    content: "";
    position: absolute;
    z-index: -1;
    transition: var(--transition);
  }

  .clear > button::after {
    height: 100%;
    width: 0;
    top: 0;
    left: 0;
  }

  .clear > button:active::after {
    width: 100%;
  }

  .remove-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }
</style>
