<script lang="ts">
  import { currentEmoji, currentColor, editableMap as map } from "../store";

  let showIndex = false;
  let paintMode = false;

  // TODO: State machine for delete mode

  function resetBackgrounds() {
    // TODO
  }

  function resetObjects() {
    // TODO
  }

  function clickedCell(index: number) {
    if ($currentColor == "") {
      map.deleteBackground(index);
    } else {
      map.updateBackground(index, $currentColor);
    }

    if ($currentEmoji == "") {
      map.removeEmoji(index);
    } else {
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
  </section>
</section>

<style>
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
</style>
