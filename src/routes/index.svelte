<script lang="ts">
  // VIEWS
  import Play from "../views/Play.svelte";
  import Editor from "../views/Editor.svelte";
  import Rules from "../views/Rules.svelte";

  import { emojis } from "../emojis";
  import { currentEmoji } from "../store";

  let filter = "";
  let viewIndex = 2;

  let views = [
    { component: Play, emoji: "🎬", title: "Play" },
    { component: Editor, emoji: "🏗️", title: "Editor" },
    { component: Rules, emoji: "📜", title: "Rules" },
  ];

  let [x, y] = [0, 0];

  function setCursorEmoji(e: MouseEvent) {
    x = e.clientX;
    y = e.clientY;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code == "Escape") {
      $currentEmoji = "";
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="cursor" style="transform: translate({x + 15}px, {y}px);">
  {$currentEmoji || ""}
</div>
<main>
  <div class="playground" on:mousemove={setCursorEmoji}>
    <div id="interactive">
      <div id="toolbox">
        <div>
          <h4>Shortcuts</h4>
          <p>Esc - Deselect emoji</p>
          <!-- <p>1 - Play</p>
          <p>2 - Editor</p>
          <p>3 - Events</p>
          <p>Space - ghost mode</p> -->
        </div>
        <h4>{views[viewIndex].title}</h4>
        <div class="view noselect">
          {#each views as view, i}
            <div
              on:click={() => (viewIndex = i)}
              class:currentView={viewIndex == i}
            >
              {view.emoji}
            </div>
          {/each}
        </div>
      </div>
      <svelte:component this={views[viewIndex].component} />
    </div>
    <div id="emoji-container" class="noselect">
      <input type="text" placeholder="search" bind:value={filter} />
      {#each Object.keys(emojis) as category}
        {#if emojis[category].some((item) => item.name.includes(filter))}
          <h4>{category}</h4>
        {/if}
        <div class="flex">
          {#each emojis[category] as { emoji, unicode_version, name }}
            {#if name.includes(filter) && +unicode_version < 13}
              <div
                class:selected={$currentEmoji == emoji}
                on:click={() => ($currentEmoji = emoji)}
                title={name}
              >
                {emoji}
              </div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .cursor {
    position: absolute;
    z-index: 99;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    height: 100vh;
    box-sizing: border-box;
  }

  .playground {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: start;
    width: 100%;
  }

  .playground > div {
    height: 100vh;
    width: 75%;
    box-sizing: border-box;
  }

  #toolbox {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    background-color: antiquewhite;
    border-bottom: 2px solid black;
    box-sizing: border-box;
  }

  .view {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  #toolbox h4,
  p {
    font-size: 1rem;
    padding: 0;
    margin: 0;
  }

  .currentView {
    border: 2px solid black;
  }

  #emoji-container {
    background-color: var(--secondary);
    width: 25%;
    font-size: 1.4rem;
    padding: 0.5rem;
    border-left: 2px solid black;
    overflow-y: auto;
  }

  #emoji-container .flex {
    display: flex;
    flex-wrap: wrap;
  }

  .selected {
    border: 2px solid red;
  }
</style>
