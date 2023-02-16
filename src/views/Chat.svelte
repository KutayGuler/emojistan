<script lang="ts">
  import { Choice } from "$src/types";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let character = "🐸";
  export let dialogueTree = new Map<string, Array<string | Choice>>();

  let mainBranches: Array<string> = [];
  let subBranches: Array<string> = [];

  for (let key of dialogueTree.keys()) {
    if (key.split("_").length == 1) {
      mainBranches.push(key);
    }
  }

  let currentBranch = mainBranches[0];
  let currentSubBranch = "1";

  for (let key of dialogueTree.keys()) {
    if (key[0] == currentBranch) {
      subBranches.push(key);
    }
  }

  let chatIndex = 0;
  let animating = false;
  let answerIndexes: Array<number> = [];

  function makeChoice(to: string, text: string) {
    chatIndex = chatIndex - choices.length + 1;
    choices = [];
    texts = [...texts, text];
    answerIndexes.push(texts.length - 1);
    currentSubBranch = to;
    subBranchChanged();
  }

  onMount(() => {
    chatIndex++;
  });

  let currentDialogue = dialogueTree.get(currentSubBranch);
  let texts: Array<string> = [];
  let choices: Array<Choice> = [];

  function subBranchChanged() {
    currentDialogue = dialogueTree.get(currentSubBranch);
    if (!currentDialogue) return;

    for (let item of currentDialogue) {
      if (typeof item == "string") {
        texts.push(item);
      } else {
        choices.push(item);
      }
    }

    texts = texts;
    choices = choices;
  }

  subBranchChanged();
</script>

<svelte:window
  on:keydown={(e) => {
    if (!currentDialogue) return;

    if (e.code == "Space") {
      if (chatIndex == currentDialogue.length) return;
      chatIndex++;

      if (currentDialogue[chatIndex - 1] instanceof Choice) {
        chatIndex = currentDialogue.length;
      }
      return;
    }
  }}
/>

<div>
  <h1 class="text-2xl">PREVIEW</h1>
  <h1 class="text-2xl">{character}</h1>
  <ul>
    {#each texts as text, i}
      {#if i < chatIndex && !animating}
        <li
          class="chat {answerIndexes.includes(i) ? 'chat-end' : 'chat-start'}"
          transition:fly={{ x: -100 }}
        >
          <span class="chat-bubble">
            {text}
          </span>
        </li>
      {/if}
    {/each}
    <div class="flex flex-row gap-2 pl-4">
      {#each choices as choice, i}
        {#if i + texts.length < chatIndex && !animating}
          <button
            transition:fly={{ x: 100 }}
            class="btn flex-grow"
            on:click={() => makeChoice(choice.to, choice.text)}
            ><p>{choice.text}</p>
          </button>
        {/if}
      {/each}
    </div>
  </ul>
</div>

<style>
  .chat span {
    border-bottom-left-radius: 12px !important;
  }

  .chat span::before {
    display: none;
  }
</style>
