<script lang="ts">
  import { Choice } from "$src/types";
  import { notifications } from "../notifications";

  let dialogueTree = new Map<string, Array<string | Choice>>([
    [
      "1",
      [
        "hello",
        "what's up",
        "n-word",
        "will you help me recover racism?",
        new Choice("1_2", "no"),
      ],
    ],
    // ["1_2", ["get ready to get destroyed babi"]],
  ]);

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

  let currentDialogue = dialogueTree.get(currentSubBranch);
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

    let key = biggestValue.toString();

    dialogueTree.set(key, ["SAMPLE TEXT"]);
    mainBranches = [...mainBranches, key];
    dialogueTree = dialogueTree;
  }

  function deleteBranch() {
    dialogueTree.delete(currentSubBranch);
    currentSubBranch = dialogueTree.keys().next().value;
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

  // TODO: Switch to added branch | sub branch

  function addChoice() {
    let numberOfSiblings = 1;
    // TODO: Sort based on biggest value

    for (let key of dialogueTree.keys()) {
      if (
        key[0] == currentBranch &&
        key.split(currentBranch + "_").length > 1
      ) {
        numberOfSiblings++;
      }
    }

    console.log(numberOfSiblings);

    let to = currentSubBranch + "_" + numberOfSiblings;
    dialogueTree.set(to, ["SAMPLE TEXT"]);
    currentDialogue?.push(new Choice(to, currentText));
    dialogueTree = dialogueTree;
    currentText = "";
    subBranches = [...subBranches, to];
  }

  function remove(key: string, index: number) {
    if (key == currentSubBranch) {
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

  function branchChanged() {
    subBranches = [];
    for (let key of dialogueTree.keys()) {
      if (key[0] == currentBranch) {
        subBranches.push(key);
      }
    }

    currentSubBranch = subBranches[0];
    currentDialogue = dialogueTree.get(currentSubBranch);
  }

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

    if (e.code == "ArrowDown") {
      let keys = dialogueTree.keys();
      if (currentIndex + 1 == currentDialogue.length) {
        while (keys.next().value != currentSubBranch) {}
        let value = keys.next().value;
        if (dialogueTree.get(value)?.length == 0) return;
        currentSubBranch = value || currentSubBranch;
        subBranchChanged();
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      return;
    }

    if (e.code == "ArrowUp") {
      let keys = dialogueTree.keys();
      if (currentIndex == 0) {
        let prev = currentSubBranch;
        for (let key of keys) {
          if (key == currentSubBranch) break;
          prev = key;
        }
        currentSubBranch = prev;
        subBranchChanged();
        currentIndex = currentDialogue.length - 1;
      } else {
        currentIndex--;
      }
      return;
    }
  }}
/>

<div class="flex flex-col gap-4 p-4">
  <div class="flex flex-row gap-4">
    <div>
      <label class="label">
        <span class="label-text"> Main Branch </span>
      </label>
      <select
        class="select select-bordered w-full"
        bind:value={currentBranch}
        on:change={branchChanged}
      >
        {#each mainBranches as key}
          <option value={key}>{key}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="label">
        <span class="label-text"> Sub Branch </span>
      </label>
      <select
        class="select select-bordered w-full"
        bind:value={currentSubBranch}
        on:change={subBranchChanged}
      >
        {#each subBranches as key}
          <option value={key}>{key == currentBranch ? "main" : key}</option>
        {/each}
      </select>
    </div>
  </div>
  <button class="btn" on:click={addBranch}>ADD BRANCH</button>
  <button class="btn" on:click={deleteBranch}
    >DELETE BRANCH # {currentSubBranch}</button
  >
  <div>
    <input type="text" class="input input-bordered" bind:value={currentText} />
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
      {#if key.split("_")[0] == currentBranch}
        <button on:click={() => toggleExpandOf(key)} class="text-xl"
          >{key}</button
        >
        {#if expands.get(key)}
          {#each dialogue as text, i}
            {@const isString = typeof text == "string"}
            <div class="flex w-full flex-row justify-between gap-4 pl-4">
              <p>
                {#if key == currentSubBranch && currentIndex == i}📍{/if}
              </p>
              <p class="flex-grow">
                {#if isString}{text}{:else}{text.text} -> {text.to}{/if}
              </p>
              <button on:click={() => remove(key, i)}>X</button>
            </div>
          {/each}
        {/if}
      {/if}
    {/each}
  </div>
</div>
