<script lang="ts">
  import { Choice } from "$src/types";
  import { createEventDispatcher, onMount } from "svelte";
  import { fly, scale } from "svelte/transition";
  import { dialogueTree } from "$src/store";
  const dispatch = createEventDispatcher();

  export let character = "🐸";
  // export let dialogueTree = new Map<string, Array<string | Choice>>();
  export let dialogueID: string;

  let mainBranches: Array<string> = [];
  let subBranches: Array<string> = [];
  let currentBranch = dialogueID[0];
  let currentSubBranch = dialogueID;
  let chatIndex = 0;
  let animating = false;
  let answerIndexes: Array<number> = [];

  onMount(() => {
    chatIndex++;
  });

  for (let key of $dialogueTree.keys()) {
    if (key.split("_").length == 1) {
      mainBranches.push(key);
    }

    if (key[0] == currentBranch) {
      subBranches.push(key);
    }
  }

  function makeChoice(to: string, text: string) {
    chatIndex = chatIndex - choices.length + 1;
    choices = [];
    texts = [...texts, text];
    answerIndexes.push(texts.length - 1);
    currentSubBranch = to;
    subBranchChanged();
  }

  let currentDialogue = $dialogueTree.get(currentSubBranch);
  let texts: Array<string> = [];
  let choices: Array<Choice> = [];

  function subBranchChanged() {
    currentDialogue = $dialogueTree.get(currentSubBranch);
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
      if (
        chatIndex == texts.length &&
        choices.length == 0 &&
        typeof texts.at(-1) == "string"
      ) {
        dispatch("dialogueEnded");
        return;
      }

      // choosing
      if (chatIndex == currentDialogue.length) return;
      chatIndex++;

      if (typeof currentDialogue[chatIndex - 1] == "object") {
        chatIndex = currentDialogue.length;
        console.log(chatIndex);
      }
      return;
    }
  }}
/>

<!-- TODO: responsive -->
<div
  style="background-color: rgba(0, 0, 0.5, 0.5);"
  class="absolute z-50 h-[620px] w-full"
  transition:scale|local
>
  <h1 class="p-4 text-4xl">{character}</h1>
  <ul>
    {#each texts as text, i}
      {#if i < chatIndex && !animating}
        <li
          class="chat {answerIndexes.includes(i) ? 'chat-end' : 'chat-start'}"
          transition:fly|local={{ x: -100 }}
        >
          <span class="chat-bubble">
            {text}
          </span>
        </li>
      {/if}
    {/each}
    <div class="flex flex-row gap-2 px-4 pt-1">
      {#each choices as choice, i}
        {#if i + texts.length < chatIndex && !animating}
          <button
            transition:fly|local={{ x: 100 }}
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
