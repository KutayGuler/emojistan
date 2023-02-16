<script lang="ts">
  import { CROSS } from "$src/constants";
  import { Choice } from "$src/types";
  import { notifications } from "../notifications";
  import { dialogueTree } from "$src/store";
  // [[
  //   "1",
  //   [
  //     "hello",
  //     "what's up",
  //     "n-word",
  //     "will you help me recover racism?",
  //     new Choice("1_2", "no"),
  //   ],
  // ],
  // ["1_2", ["get ready to get destroyed babi"]]],
  let currentText = "";
  let currentIndex = 0;

  // let dialogueTree = new Map<string, Array<string | Choice>>();
  let currentDialogue: Array<string | Choice> = [];
  let mainBranches: Array<string> = [];
  let subBranches: Array<string> = [];
  let currentSubBranch: string;
  let currentBranch: string;

  $: mainBranches = [...$dialogueTree.keys()].filter((key) => key.length == 1);
  $: subBranches = [...$dialogueTree.keys()].filter(
    (key) => key[0] == currentBranch
  );
  $: currentDialogue = $dialogueTree.get(currentSubBranch) || [];

  function addBranch() {
    let biggestValue = 1;
    for (let key of $dialogueTree.keys()) {
      let main = +key.split("_")[0];
      if (biggestValue <= main) {
        biggestValue = main + 1;
      }
    }

    let key = biggestValue.toString();

    dialogueTree.add(key, ["### SAMPLE TEXT ###"]);
    expands.set(key, true);
    currentBranch = key;
    currentSubBranch = key;
    $dialogueTree = $dialogueTree;
  }

  function deleteBranch() {
    dialogueTree.remove(currentSubBranch);
    currentSubBranch = $dialogueTree.keys().next().value || "";
  }

  function branchChanged() {
    currentSubBranch = currentBranch;
  }

  function insertText() {
    console.log(currentDialogue[currentIndex]);

    if (!currentDialogue) return;
    if (currentDialogue[currentIndex] instanceof Choice) {
      notifications.warning("You cannot add text after choice");
      return;
    }

    currentDialogue?.splice(currentIndex + 1, 0, currentText);
    $dialogueTree = $dialogueTree;
    currentText = "";
  }

  function renameText() {
    if (currentDialogue[currentIndex] instanceof Choice) {
      // @ts-expect-error
      currentDialogue[currentIndex].text = currentText;
    } else {
      currentDialogue[currentIndex] = currentText;
    }

    currentText = "";
    $dialogueTree = $dialogueTree;
  }

  // TODO: arrows shouldn't jump between main branches

  function appendChoice() {
    let numberOfSiblings = 1;
    // TODO: Sort based on biggest value

    for (let key of $dialogueTree.keys()) {
      if (
        key.includes(currentSubBranch) &&
        key.length == currentSubBranch.length + 2 &&
        key.split(currentSubBranch + "_").length > 1
      ) {
        numberOfSiblings++;
      }
    }

    console.log(numberOfSiblings);

    let to = currentSubBranch + "_" + numberOfSiblings;
    dialogueTree.add(to, ["### SAMPLE TEXT ###"]);
    currentDialogue?.push(new Choice(to, currentText));
    $dialogueTree = $dialogueTree;
    currentText = "";
  }

  function remove(key: string, index: number) {
    if (key == currentSubBranch) {
      if (!currentDialogue) return;
      currentDialogue.splice(index, 1);
      currentIndex = currentDialogue.length - 1;
    } else {
      let clickedDialogue = $dialogueTree.get(key);
      if (!clickedDialogue) return;
      clickedDialogue.splice(index, 1);
    }
    $dialogueTree = $dialogueTree;
  }

  let expands = new Map<string, boolean>();

  function toggleExpandOf(key: string) {
    expands.set(key, !expands.get(key));
    expands = expands;
  }
</script>

<svelte:window
  on:keydown={(e) => {
    if (!currentDialogue) return;

    if (e.code == "ArrowDown") {
      // let keys = dialogueTree.keys();
      if (currentIndex + 1 == currentDialogue.length) {
        // while (keys.next().value != currentSubBranch) {}
        // let value = keys.next().value;
        // if (dialogueTree.get(value)?.length == 0) return;
        // // TODO: check
        // currentSubBranch = value || currentSubBranch;
        // // subBranchChanged();
        // currentIndex = 0;
      } else {
        currentIndex++;
      }
      return;
    }

    if (e.code == "ArrowUp") {
      let keys = $dialogueTree.keys();
      if (currentIndex == 0) {
        let prev = currentSubBranch;
        for (let key of keys) {
          if (key == currentSubBranch) break;
          prev = key;
        }
        currentSubBranch = prev;
        // subBranchChanged();
        // currentIndex = currentDialogue.length - 1; // TODO: replace this
      } else {
        currentIndex--;
      }
      return;
    }
  }}
/>

<!-- TODO: respnsive -->
<div class="ml-24 flex h-[620px] w-full flex-row gap-4 2xl:h-[716px]">
  <aside
    class="flex h-[620px] w-72 flex-col gap-4 rounded bg-base-200 p-8 2xl:h-[716px]"
  >
    <button class="btn" on:click={addBranch}>ADD BRANCH</button>
    <button
      class="btn"
      disabled={currentSubBranch == ""}
      on:click={deleteBranch}>DELETE BRANCH # {currentSubBranch || "?"}</button
    >
    <div class="divider">TEXT</div>
    <div class="flex flex-col gap-2">
      <input
        type="text"
        class="input input-bordered"
        placeholder="Greetings"
        bind:value={currentText}
      />
      <button
        class="btn"
        disabled={currentText == "" || currentSubBranch == ""}
        on:click={insertText}>INSERT</button
      >
      <button
        class="btn flex-grow"
        disabled={currentText == "" || currentSubBranch == ""}
        on:click={appendChoice}>ADD PLAYER CHOICE (SUBBRANCH)</button
      >
      <button
        class="btn"
        disabled={currentText == "" || currentSubBranch == ""}
        on:click={renameText}>RENAME</button
      >
    </div>
    <div class="divider">CONTROLS 📍</div>
    <div class="flex w-full flex-col justify-center gap-2">
      <span>
        <kbd class="kbd">▲</kbd>
        Up
      </span>
      <span>
        <kbd class="kbd">▼</kbd>
        Down
      </span>
    </div>
  </aside>
  <div class="w-1/3 overflow-y-auto p-4">
    <div class="flex flex-row gap-4">
      <div class="flex-grow">
        <label for="main-branch" class="label">
          <span class="label-text"> Main Branch </span>
        </label>
        <select
          class="select select-bordered w-full"
          bind:value={currentBranch}
          on:change={branchChanged}
        >
          {#each mainBranches as key}
            <option value={key}>{key}</option>
          {:else}
            <option value="" disabled>No branch</option>
          {/each}
        </select>
      </div>
      <div class="flex-grow">
        <label for="sub-branch" class="label">
          <span class="label-text"> Sub Branch </span>
        </label>
        <select
          class="select select-bordered w-full"
          bind:value={currentSubBranch}
        >
          {#each subBranches as key}
            <option value={key}>{key == currentBranch ? "main" : key}</option>
          {:else}
            <option value="" disabled>No subbranch</option>
          {/each}
        </select>
      </div>
    </div>
    <div class="flex flex-col items-start justify-start gap-2">
      {#each [...$dialogueTree] as [key, dialogue]}
        {#if key.split("_")[0] == currentBranch}
          <button on:click={() => toggleExpandOf(key)} class="text-xl"
            >{key} {expands.get(key) ? "⯆" : "⯈"}</button
          >
          {#if expands.get(key)}
            {#each dialogue as text, i}
              {@const isString = typeof text == "string"}
              <div class="flex w-full flex-row justify-between gap-2 pl-4">
                <p class="flex-grow rounded bg-base-200 p-1">
                  {#if key == currentSubBranch && currentIndex == i}📍&nbsp;{/if}
                  {#if isString}{text}{:else}{text.text} -> {text.to}{/if}
                </p>
                <button class="self-start" on:click={() => remove(key, i)}
                  >{CROSS}</button
                >
              </div>
            {/each}
          {/if}
        {/if}
      {/each}
    </div>
  </div>
</div>
