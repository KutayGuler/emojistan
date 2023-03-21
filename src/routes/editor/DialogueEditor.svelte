<script lang="ts">
	import { CROSS } from '$src/constants';
	import { Choice } from '$src/types';
	import { notifications } from '../notifications';
	import { dialogueTree, interactables } from '$src/store';

	let currentText = '';
	let currentIndex = 0;
	let currentDialogue: Array<string | Choice> = [];
	let mainBranches: Array<string> = [];
	let currentBranch: string;
	let mainBranch: string;

	$: mainBranches = [...$dialogueTree.keys()].filter((key) => key.length == 1);
	$: currentDialogue = $dialogueTree.get(currentBranch) || [];

	function addBranch() {
		let biggestValue = 1;
		for (let key of $dialogueTree.keys()) {
			let main = +key.split('_')[0];
			if (biggestValue <= main) {
				biggestValue = main + 1;
			}
		}

		let key = biggestValue.toString();

		dialogueTree.add(key, ['### SAMPLE TEXT ###']);
		currentBranch = key;
		mainBranch = key;
		$dialogueTree = $dialogueTree;
	}

	function deleteBranch() {
		// TODO: Add warning modal (this will delete all subbranches of 2 do you wish to proceed?)
		for (let branch of $dialogueTree.keys()) {
			if (branch[0] == currentBranch) dialogueTree.remove(branch);
		}
		currentBranch = $dialogueTree.keys().next().value;
		mainBranch = currentBranch;
	}

	function branchChanged() {
		currentIndex = 0;
		currentBranch = mainBranch;
	}

	function insertText() {
		if (!currentDialogue) return;
		if (typeof currentDialogue[currentIndex] == 'object') {
			notifications.warning('You cannot add text after player choice');
			return;
		}

		currentDialogue?.splice(currentIndex + 1, 0, currentText);
		$dialogueTree = $dialogueTree;
		currentText = '';
	}

	function renameText() {
		if (typeof currentDialogue[currentIndex] == 'object') {
			(currentDialogue[currentIndex] as Choice).text = currentText;
		} else {
			currentDialogue[currentIndex] = currentText;
		}

		currentText = '';
		$dialogueTree = $dialogueTree;
	}

	function appendChoice() {
		let numberOfSiblings = 1;
		for (let key of $dialogueTree.keys()) {
			if (
				key.includes(currentBranch) &&
				key.length == currentBranch.length + 2 &&
				key.split(currentBranch + '_').length > 1
			) {
				numberOfSiblings++;
			}
		}

		if (numberOfSiblings > 4) {
			notifications.warning(
				'Cannot have more than 4 choices in a single branch'
			);
			return;
		}

		let to = currentBranch + '_' + numberOfSiblings;
		dialogueTree.add(to, ['### SAMPLE TEXT ###']);
		currentDialogue?.push(new Choice(to, currentText));
		$dialogueTree = $dialogueTree;
		currentText = '';
	}

	function remove(key: string, index: number) {
		if (key == currentBranch) {
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
</script>

<svelte:window
	on:keydown={(e) => {
		if (!currentDialogue) return;

		if (e.code == 'ArrowDown') {
			if (currentIndex + 1 == currentDialogue.length) {
				// jump to start
				currentIndex = 0;
			} else {
				currentIndex++;
			}
			return;
		}

		if (e.code == 'ArrowUp') {
			if (currentIndex == 0) {
				// jump to end
				currentIndex = currentDialogue.length - 1;
			} else {
				currentIndex--;
			}
			return;
		}
	}}
/>

<div
	class="flex h-[620px] flex-row items-start justify-center gap-4 2xl:h-[716px]"
>
	<aside class="aside">
		<div class="flex flex-col gap-2">
			<button class="btn w-full" on:click={addBranch}>ADD BRANCH</button>
			<button
				class="btn w-full"
				disabled={currentBranch == ''}
				on:click={deleteBranch}>DELETE BRANCH # {currentBranch || '?'}</button
			>
		</div>
		<div class="divider">TEXT</div>
		<div class="flex flex-col gap-2">
			<input
				type="text"
				class="input-bordered input"
				placeholder="Greetings"
				bind:value={currentText}
			/>
			<button
				class="btn"
				disabled={currentText == '' || currentBranch == ''}
				on:click={insertText}>INSERT</button
			>
			<button
				class="btn flex-grow"
				disabled={currentText == '' || currentBranch == ''}
				on:click={appendChoice}>ADD PLAYER CHOICE (SIBLING BRANCH)</button
			>
			<button
				class="btn"
				disabled={currentText == '' || currentBranch == ''}
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

	<div class="w-[972px] overflow-y-auto p-4 2xl:w-[1068px]">
		<div class="flex-grow">
			<label for="main-branch" class="label">
				<span class="label-text"> Interactables </span>
			</label>
			<select
				class="select-bordered select w-full"
				bind:value={mainBranch}
				on:change={branchChanged}
			>
				{#each [...$interactables] as [key, { emoji }]}
					<option value={emoji}>{emoji}</option>
				{/each}
			</select>
		</div>
		<div class="flex-grow">
			<label for="main-branch" class="label">
				<span class="label-text"> Main Branches </span>
			</label>
			<select
				class="select-bordered select w-full"
				bind:value={mainBranch}
				on:change={branchChanged}
			>
				{#each mainBranches as key}
					<option value={key}>{key}</option>
				{:else}
					<option value="" disabled>No branch</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-col items-start justify-start gap-2">
			<h3 class="py-4 text-2xl">{currentBranch || ''}</h3>
			{#each [...$dialogueTree] as [key, dialogue]}
				{#if key == currentBranch}
					{#each dialogue as text, i}
						<div class="flex w-full flex-row justify-between gap-1">
							<div
								contenteditable="true"
								class="flex-grow rounded bg-base-200 p-1 pl-2 text-start"
								bind:textContent={dialogue[i]}
							>
								{#if key == currentBranch && currentIndex == i}📍&nbsp;{/if}
								{text}
							</div>
							<button class="self-start" on:click={() => remove(key, i)}
								>{CROSS}</button
							>
						</div>
					{/each}
				{/if}
			{/each}
		</div>
	</div>
</div>
