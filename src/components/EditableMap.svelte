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

<section class="noselect">
  <input type="text" placeholder="Objective" bind:value={$map.objective} />
  <p><input type="checkbox" bind:checked={showIndex} />🔢</p>
  <div class="palette">
    <p
      on:click={() => togglePaintMode(color)}
      style:opacity={cp.length == 0 ? "50%" : "100%"}
    >
      🎨{cp.includes(color) ? "" : "🖌️"}
    </p>
    {#each cp as c}
      {@const selected = c == color}
      <div
        class="color"
        class:selected
        style="background-color: {c};"
        on:click={() => togglePaintMode(c)}
      />
    {/each}
  </div>
  <div class="map">
    {#each { length: 256 } as _, i}
      <div
        style:background={$map.backgrounds[i] || "var(--default-background)"}
        on:click={() => clickedCell(i)}
      >
        {$map?.items[i]?.emoji || (showIndex ? i : "")}
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
