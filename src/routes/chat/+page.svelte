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
  ]);

  // dialogueTree.set("1_2", ["get ready to get destroyed babi"]);

  let currentKey = "1";
  let chatIndex = 0;
  let animating = false;

  function makeChoice(to: string) {
    chatIndex = 0;
    currentKey = to;
  }

  onMount(() => {
    chatIndex++;
  });

  let currentDialogue = dialogueTree.get(currentKey);
  let currentText = "";
  let currentIndex = 0;

  // TODO: insert by currentIndex
  function addText() {
    if (Array.isArray(currentDialogue?.at(-1))) {
      notifications.warning("You cannot add text after choice");
      return;
    }

    currentDialogue.push(currentText);
    dialogueTree = dialogueTree;
    currentText = "";
  }

  // TODO: insert by currentIndex
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

  function remove(index: number) {
    if (!currentDialogue) return;
    let item = currentDialogue[index];
    if (item instanceof Choice) {
      dialogueTree.delete(item.to);
    }
    currentDialogue?.splice(index, 1);
    dialogueTree = dialogueTree;
  }

  function addTextBeforeLast() {
    // edge-case: can't have more than 1 array (choice) inside a dialogue
  }

  let expands = new Map();

  function toggleExpandOf(key: string) {
    expands.set(key, !expands.get(key));
    expands = expands;
  }

  let texts: Array<string> = [];
  let choices: Array<Choice> = [];

  function currentKeyChanged() {
    currentDialogue = dialogueTree.get(currentKey);
    if (!currentDialogue) return;
    choices = [];
    texts = [];

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
    if (e.code == "Space") {
      chatIndex++;

      if ((currentDialogue || [])[chatIndex] instanceof Choice) {
        chatIndex = currentDialogue?.length || 1;
      }
      return;
    }

    // console.log(dialogueTree);

    if (!currentDialogue) return;

    if (e.code == "ArrowDown") {
      let keys = dialogueTree.keys();
      if (currentIndex + 1 == currentDialogue.length) {
        while (keys.next().value != currentKey) {}
        currentKey = keys.next().value;
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
    <input type="text" class="input input-bordered" bind:value={currentText} />
    <button class="btn" disabled={currentText == ""} on:click={addText}
      >add</button
    >
    <button class="btn" disabled={currentText == ""} on:click={addChoice}
      >ADD AS CHOICE</button
    >
    <h1 class="text-2xl">List View</h1>
    <div class="flex flex-col items-start justify-start">
      {#each [...dialogueTree] as [key, dialogue]}
        <button on:click={() => toggleExpandOf(key)} class="text-xl"
          >{key}</button
        >
        {#if expands.get(key)}
          {#each dialogue as text, i}
            <div
              class="flex w-full flex-row justify-between gap-4 pl-4"
              on:click={() => (currentIndex = i)}
            >
              <p>
                {#if key == currentKey && currentIndex == i}📍{/if}
              </p>
              <p class="flex-grow">
                {#if typeof text == "string"}{text}{:else}{text.text} -> {text.to}{/if}
              </p>
              <button on:click={() => remove(i)}>X</button>
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
          <li class="chat chat-start" transition:fly={{ x: 100 }}>
            <span class="chat-bubble">
              {text}
            </span>
          </li>
        {/if}
      {/each}
      <div
        class="flex flex-row gap-2 pl-4"
        transition:fly={{ x: 100 }}
        on:outrostart={() => (animating = true)}
        on:outroend={() => {
          animating = false;
          chatIndex++;
        }}
      >
        {#each choices as choice, i}
          {#if i + texts.length < chatIndex && !animating}
            <button class="btn flex-grow" on:click={() => makeChoice(choice.to)}
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
