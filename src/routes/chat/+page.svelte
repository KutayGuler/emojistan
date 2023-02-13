<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { notifications } from "../notifications";

  interface Choice {
    to: string;
    text: string;
    consequences: Array<[string, number]>;
  }

  class Choice {
    constructor(
      to: string,
      text: string,
      consequences: Array<[string, number]>
    ) {
      this.to = to;
      this.text = text;
      this.consequences = consequences;
    }
  }

  let character = "🐸";
  let dialogueTree = new Map<string, Array<string | Array<Choice>>>();
  dialogueTree.set("1", [
    // "hello",
    // "what's up",
    // "n-word",
    "will you help me recover racism?",
    [
      new Choice("1_1", "yes", [
        ["🥇", -5],
        ["🐐", 2],
      ]),
      new Choice("1_2", "no", [["🍆", 3]]),
    ],
  ]);

  dialogueTree.set("1_2", ["get ready to get destroyed babi"]);

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
  $: currentDialogue = dialogueTree.get(currentKey);

  let currentText = "";

  function addTextToDialogue(text: string) {
    if (Array.isArray(currentDialogue?.at(-1))) {
      notifications.warning("You cannot add text after choice");
      return;
    }

    currentDialogue.push(text);
  }

  // test

  function addTextBeforeLast() {
    // edge-case: can't have more than 1 array (choice) inside a dialogue
  }

  // TODO: Switch to dev branch before doing all that
  // TODO: Add stack to Equippable | Consumable
  // TODO: Consumables should also be pickable (green tint behind item if it is consumable)

  function formatCost(cost: number) {
    if (cost == 1) return "+";
    if (cost == -1) return "-";

    if (cost > 1) {
      return "+" + cost;
    }

    return cost;
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.code == "Space") {
      chatIndex++;

      if (Array.isArray((currentDialogue || [])[chatIndex])) {
        chatIndex++;
      }
    }
  }}
/>

<main class="p-4">
  <input type="text" class="input input-bordered" bind:value={currentText} />
  <button
    class="btn"
    on:click={() => {
      addTextToDialogue(currentText);
      currentText = "";
    }}>add</button
  >
  <button
    class="btn"
    on:click={() => {
      addTextToDialogue(currentText);
      currentText = "";
    }}>ADD CHOICE</button
  >

  <h1 class="text-2xl">{character}</h1>
</main>
<ul>
  {#each currentDialogue || [] as dialogue, i}
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
            <button
              class="btn flex h-24 w-1/6 flex-col py-4"
              on:click={() => makeChoice(choice.to)}
              ><p>{choice.text}</p>

              <br />
              <div>
                {#each choice.consequences as [item, cost]}
                  {formatCost(cost)} {item} <br />
                {/each}
              </div>
            </button>
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

<style>
  li span {
    border-bottom-left-radius: 12px !important;
  }

  li span::before {
    display: none;
  }
</style>
