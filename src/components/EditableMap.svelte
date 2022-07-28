<script lang="ts">
  import { currentEmoji, colorPalette, editableMap as map } from "../store";

  let cp = $colorPalette;
  let showIndex = false;
  let paintMode = false;
  let color = "";

  function clickedCell(index: number) {
    if (paintMode) {
      map.updateBackground(index, color);
      return;
    } else if ($currentEmoji == "") {
      map.deleteBackground(index);
    }

    if ($currentEmoji == "") {
      map.removeEmoji(index);
      return;
    }

    map.addEmoji({
      index,
      emoji: $currentEmoji,
    });
  }

  function togglePaintMode(c: string) {
    if (color == c) {
      paintMode = false;
      color = "";
      return;
    }
    paintMode = true;
    color = c;
  }
</script>

<section class="noselect editable-map">
  <input type="text" placeholder="Objective" bind:value={$map.objective} />
  <p><input type="checkbox" bind:checked={showIndex} />🔢</p>
  <div class="palette">
    <p
      on:click={() => togglePaintMode(color)}
      style:opacity={cp.size == 0 ? "50%" : "100%"}
    >
      🎨{cp.has(color) ? "" : "🖌️"}
    </p>
    {#each [...cp] as c}
      <div
        class="color"
        class:selected={c == color}
        style:background={c}
        on:click={() => togglePaintMode(c)}
      />
    {/each}
  </div>
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

<style>
  .editable-map {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .color {
    width: 50px;
    height: 50px;
  }

  .palette {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .selected::after {
    content: "🖌️";
    color: white;
    mix-blend-mode: difference;
  }
</style>
