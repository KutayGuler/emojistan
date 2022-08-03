<script lang="ts">
  import { currentEmoji, currentColor, editableMap as map } from "../store";
  import { longpress } from "../utils/longpress";

  let showIndex = false;
  let deleteMode = "Both";

  function clickedCell(index: number) {
    if ($currentColor == "" && $currentEmoji == "") {
      switch (deleteMode) {
        case "Emoji":
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
    <div>
      Delete Mode:
      {#each ["Emoji", "Background", "Both"] as mode}
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
    <!-- TODO: change styling-->
    <button class="reset" use:longpress on:longpress={map.resetObjects}
      >Reset Objects</button
    >
    <button class="reset" use:longpress on:longpress={map.resetBackgrounds}
      >Reset Backgrounds</button
    >
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

  .reset {
    border-radius: 3px;
    text-decoration: none;
    position: relative;
    padding: 16px;
    border: 1px solid white;
    z-index: 20;
    transition: var(--transition);
    border-color: pink;
    color: pink;
  }

  .reset:active {
    color: white;
  }

  .reset::before,
  .reset::after {
    background: pink;
    content: "";
    position: absolute;
    z-index: -1;
    transition: var(--transition);
  }

  .reset::after {
    height: 100%;
    width: 0;
    top: 0;
    left: 0;
  }

  .reset:active::after {
    width: 100%;
  }
</style>
