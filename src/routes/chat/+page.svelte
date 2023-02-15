<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { notifications } from "../notifications";

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
  let dialogueTree = new Map<string, Array<string | Choice>>();
  dialogueTree.set("1", [
    "hello",
    "what's up",
    "n-word",
    "will you help me recover racism?",
    new Choice("1_2", "no"),
  ]);

  dialogueTree.set("1_2", ["get ready to get destroyed babi"]);

  let currentKey = "1";
  let chatIndex = 0;
  let animating = false;

  let answerIndexes: Array<number> = [];

  function makeChoice(to: string, text: string) {
    chatIndex = chatIndex - choices.length + 1;
    choices = [];
    texts = [...texts, text];
    answerIndexes.push(texts.length - 1);
    currentKey = to;
    currentKeyChanged();
  }

  onMount(() => {
    chatIndex++;
  });

  let currentDialogue = dialogueTree.get(currentKey);
  let currentText = "";
  let currentIndex = 0;

  function addBranch() {
    let biggestValue = 1;
    for (let key of dialogueTree.keys()) {
      let main = +key.split("_")[0];
      if (biggestValue <= main) {
        biggestValue = main + 1;
      }
    }

    dialogueTree.set(biggestValue.toString(), []);
    dialogueTree = dialogueTree;
  }

  function deleteBranch() {
    dialogueTree.delete(currentKey);
    currentKey = dialogueTree.keys().next().value;
    dialogueTree = dialogueTree;
  }

  function insertText() {
    if (!currentDialogue) return;
    if (currentDialogue[currentIndex - 1] instanceof Choice) {
      notifications.warning("You cannot add text after choice");
      return;
    }

    currentDialogue?.splice(currentIndex, 0, currentText);
    dialogueTree = dialogueTree;
    currentText = "";
  }

  function addChoice() {
    let numberOfSiblings = 1;

    for (let key of dialogueTree.keys()) {
      if (key.includes(currentKey + "_")) {
        numberOfSiblings++;
      }
    }

    let to = currentKey + "_" + numberOfSiblings;
    dialogueTree.set(to, []);
    currentDialogue?.push(new Choice(to, currentText));
    dialogueTree = dialogueTree;
    currentText = "";
  }

  function remove(key: string, index: number) {
    if (key == currentKey) {
      if (!currentDialogue) return;
      currentDialogue.splice(index, 1);
      currentIndex = currentDialogue.length - 1;
    } else {
      let clickedDialogue = dialogueTree.get(key);
      if (!clickedDialogue) return;
      clickedDialogue.splice(index, 1);
    }
    dialogueTree = dialogueTree;
  }

  let expands = new Map<string, boolean>();

  function toggleExpandOf(key: string) {
    expands.set(key, !expands.get(key));
    expands = expands;
  }

  let texts: Array<string> = [];
  let choices: Array<Choice> = [];

  function currentKeyChanged() {
    currentDialogue = dialogueTree.get(currentKey);
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

  currentKeyChanged();
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

    if (e.code == "ArrowDown") {
      let keys = dialogueTree.keys();
      if (currentIndex + 1 == currentDialogue.length) {
        while (keys.next().value != currentKey) {}
        let value = keys.next().value;
        if (dialogueTree.get(value)?.length == 0) return;
        currentKey = value || currentKey;
        currentKeyChanged();
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      return;
    }

    if (e.code == "ArrowUp") {
      let keys = dialogueTree.keys();
      if (currentIndex == 0) {
        let prev = currentKey;
        for (let key of keys) {
          if (key == currentKey) {
            break;
          } else {
            prev = key;
          }
        }
        currentKey = prev;
        currentKeyChanged();
        currentIndex = currentDialogue.length - 1;
      } else {
        currentIndex--;
      }
      return;
    }
  }}
/>

<main class="flex w-full flex-row justify-evenly p-4">
  <div>
    <select
      class="select select-bordered"
      bind:value={currentKey}
      on:change={currentKeyChanged}
    >
      {#each [...dialogueTree.keys()] as key}
        <option value={key}>{key}</option>
      {/each}
    </select>
    <button class="btn" on:click={addBranch}>ADD BRANCH</button>
    <button class="btn" on:click={deleteBranch}
      >DELETE BRANCH # {currentKey}</button
    >
    <div>
      <input
        type="text"
        class="input input-bordered"
        bind:value={currentText}
      />
      <button class="btn" disabled={currentText == ""} on:click={insertText}
        >INSERT</button
      >
      <button class="btn" disabled={currentText == ""} on:click={addChoice}
        >ADD CHOICE</button
      >
    </div>
    <h1 class="text-2xl">List View</h1>
    <div class="flex flex-col items-start justify-start">
      {#each [...dialogueTree] as [key, dialogue]}
        <button on:click={() => toggleExpandOf(key)} class="text-xl"
          >{key}</button
        >
        {#if expands.get(key)}
          {#each dialogue as text, i}
            {@const isString = typeof text == "string"}
            <div class="flex w-full flex-row justify-between gap-4 pl-4">
              <p>
                {#if key == currentKey && currentIndex == i}📍{/if}
              </p>
              <p class="flex-grow">
                {#if isString}{text}{:else}{text.text} -> {text.to}{/if}
              </p>
              <button on:click={() => remove(key, i)}>X</button>
            </div>
          {/each}
        {/if}
      {/each}
    </div>
  </div>

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
</main>

<style>
  .chat span {
    border-bottom-left-radius: 12px !important;
  }

  .chat span::before {
    display: none;
  }
</style>
