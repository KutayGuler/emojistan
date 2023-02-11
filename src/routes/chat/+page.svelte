<script lang="ts">
  import { fade, fly } from "svelte/transition";

  interface Choice {
    to: string;
    text: string;
  }

  class Choice {
    constructor(to: string, text: string) {
      this.to = to;
      this.text = text;
    }
  }

  let character = "🐸";
  let dialogueTree = new Map<string, Array<string | Array<Choice>>>();
  dialogueTree.set("1", [
    "hello",
    "what's up",
    "n-word",
    "will you help me recover racism?",
    [new Choice("2", "yes"), new Choice("3", "no")],
  ]);

  dialogueTree.set("3", ["get ready to get destroyed babi"]);

  let currentKey = "1";
  let chatIndex = 0;
  let animating = false;

  function makeChoice(to: string) {
    chatIndex = 0;
    currentKey = to;
  }
</script>

<svelte:window
  on:keydown={(e) => {
    // if (animating) return;
    if (e.code == "Space") {
      chatIndex++;
    }
  }}
/>

<!-- {#key currentKey} -->
<h1 class="text-2xl">{character}</h1>
<ul>
  {#each dialogueTree.get(currentKey) || [] as dialogue, i}
    {#if i < chatIndex && !animating}
      {#if Array.isArray(dialogue)}
        <div
          class="flex flex-row gap-2 pl-4"
          transition:fly={{ x: 100 }}
          on:outrostart={() => (animating = true)}
          on:outroend={() => {
            animating = false;
            chatIndex++;
          }}
        >
          {#each dialogue as choice}
            <button class="btn w-1/6" on:click={() => makeChoice(choice.to)}
              >{choice.text}</button
            >
          {/each}
        </div>
      {:else}
        <li class="chat chat-start" transition:fly={{ x: 100 }}>
          <span class="chat-bubble">
            {dialogue}
          </span>
        </li>
      {/if}
    {/if}
  {/each}
</ul>
<!-- {/key} -->

<!-- {#each [...dialogueTree] as [id, dialogue]}
  <h1 class="text-2xl">{id}</h1>
  {#each dialogue as d}
    {#if Array.isArray(d)}
      {#each d as choice}
        <p>{choice.text}</p>
        <p>{choice.to}</p>
      {/each}
    {:else}
      <p>{d}</p>
    {/if}
  {/each}
{/each} -->
<style>
  /* :not(:first-child) */

  li span {
    border-bottom-left-radius: 12px !important;
  }

  li span::before {
    display: none;
  }

  /* .chat-bubble {
  } */
</style>
