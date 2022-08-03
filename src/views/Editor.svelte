<script lang="ts">
  import { currentEmoji, currentColor, editableMap as map } from "../store";
  import { longpress } from "../utils/longpress";

  let showIndex = false;
  let deleteMode = "Both";

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
      map.addEmoji({
        index,
        emoji: $currentEmoji,
      });
    }
  }
</script>

<section class="editor">
  <section class="noselect editable-map">
    <input type="text" placeholder="Objective" bind:value={$map.objective} />
    <p><input type="checkbox" bind:checked={showIndex} />🔢</p>
    <slot />
    <div class="map">
      {#each { length: 256 } as _, i}
        <div
          style:background={$map.backgrounds.get(i) ||
            "var(--default-background)"}
          on:click={() => clickedCell(i)}
        >
          {$map?.items.get(i)?.emoji || (showIndex ? i : "")}
        </div>
      {/each}
    </div>
    <div class="remove-actions">
      <div>
        Delete Mode:
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
      <div class="clear">
        Clear:
        <button use:longpress on:longpress={map.clearObjects}> Items </button>
        <button use:longpress on:longpress={map.clearBackgrounds}>
          Backgrounds
        </button>
        <button use:longpress on:longpress={map.clearAll}> All </button>
      </div>
    </div>
  </section>
</section>

<style>
  :root {
    --transition: 500ms;
  }

  .editor {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 100%;
    height: 90vh;
  }

  .editable-map {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .clear > button {
    border-radius: 3px;
    text-decoration: none;
    position: relative;
    border: 1px solid var(--primary);
    z-index: 20;
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
    justify-content: space-between;
    width: 100%;
  }
</style>
