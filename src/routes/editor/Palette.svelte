<script lang="ts">
  // DATA
  import { palette as cp, currentColor, map } from "$src/store";
  import { scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { notifications } from "$src/routes/notifications";
  import { DEFAULT_BG } from "$src/constants";

  let pickedColor = "#000000";
  const flipParams = { duration: 300 };

  function setDefaultBackground(color: string) {
    if (color == "") return;
    if (color == $map.dbg) {
      map.updateDbg(DEFAULT_BG);
      return;
    }

    map.updateDbg(color);
    map.filterBackgrounds();
  }

  function removeColor(color: string) {
    cp.remove(color);
    if (!$cp.has($map.dbg)) {
      map.updateDbg(DEFAULT_BG);
    }
  }

  function addColor(e) {
    if (e.target.tagName == "INPUT") return;

    if ($cp.size == 8) {
      notifications.warning("Number of colors cannot exceed 8");
      return;
    }
    cp.add(pickedColor);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex flex-row gap-2">
    <input
      class="h-12 w-12 cursor-pointer"
      type="color"
      bind:value={pickedColor}
    />
    <button
      disabled={$cp.has(pickedColor)}
      title="Add selected color"
      class="btn flex-grow text-2xl"
      on:click={addColor}
    >
      +
    </button>
  </div>

  <div class="inline-flex w-full items-center justify-start gap-2 pt-2">
    {#each [...$cp] as color (color)}
      <div
        class="{color == $currentColor
          ? 'scale-125'
          : ''} dropdown-hover dropdown h-12 w-12 cursor-pointer rounded duration-150 ease-out hover:scale-125"
        transition:scale|local={flipParams}
        animate:flip={flipParams}
        style:background={color}
        on:click={(e) => {
          // @ts-expect-error
          if (e.target.tagName == "LI") return;
          if ($currentColor == color) {
            $currentColor = "";
          } else {
            $currentColor = color;
          }
        }}
      >
        <ul
          tabindex="0"
          class="dropdown-content menu rounded-box mt-12 bg-base-100 p-2 shadow"
        >
          <li
            on:click={() => setDefaultBackground(color)}
            title="Set as default background color"
            class=""
          >
            🌍
          </li>
          <li
            on:click={() => removeColor(color)}
            title="Remove selected color"
            class=" "
          >
            ❌
          </li>
        </ul>
      </div>
    {/each}
  </div>
</div>

<style>
  .default,
  .selected {
    opacity: 1;
  }
</style>
