<script lang="ts">
	import { CROSS } from '$src/constants'
	import { Choice } from '$src/types'
	import { notifications } from '../notifications'
	import { dialogueTree } from '$src/store'

	let currentText = ''
	let currentIndex = 0
	let currentDialogue: Array<string | Choice> = []
	let mainBranches: Array<string> = []
	let siblingBranches: Array<string> = []
	let currentBranch: string

	$: mainBranches = [...$dialogueTree.keys()].filter((key) => key.length == 1)
	$: siblingBranches = [...$dialogueTree.keys()].filter(
		(key) => key[0] == currentBranch?.split('_')[0]
	)
	$: currentDialogue = $dialogueTree.get(currentBranch) || []

	function addBranch() {
		let biggestValue = 1
		for (let key of $dialogueTree.keys()) {
			let main = +key.split('_')[0]
			if (biggestValue <= main) {
				biggestValue = main + 1
			}
		}

		let key = biggestValue.toString()

		dialogueTree.add(key, ['### SAMPLE TEXT ###'])
		expands.set(key, true)
		currentBranch = key
		// currentSubBranch = key
		$dialogueTree = $dialogueTree
	}

	function deleteBranch() {
		dialogueTree.remove(currentBranch)
		currentBranch = $dialogueTree.values().next().value
	}

	function branchChanged() {
		currentIndex = 0
	}

	function insertText() {
		if (!currentDialogue) return
		if (typeof currentDialogue[currentIndex] == 'object') {
			notifications.warning('You cannot add text after player choice')
			return
		}

		currentDialogue?.splice(currentIndex + 1, 0, currentText)
		$dialogueTree = $dialogueTree
		currentText = ''
	}

	function renameText() {
		if (typeof currentDialogue[currentIndex] == 'object') {
			;(currentDialogue[currentIndex] as Choice).text = currentText
		} else {
			currentDialogue[currentIndex] = currentText
		}

		currentText = ''
		$dialogueTree = $dialogueTree
	}

	function appendChoice() {
		let numberOfSiblings = 1
		for (let key of $dialogueTree.keys()) {
			if (
				key.includes(currentBranch) &&
				key.length == currentBranch.length + 2 &&
				key.split(currentBranch + '_').length > 1
			) {
				numberOfSiblings++
			}
		}

		if (numberOfSiblings > 4) {
			notifications.warning(
				'Cannot have more than 4 choices in a single branch'
			)
			return
		}

		let to = currentBranch + '_' + numberOfSiblings
		dialogueTree.add(to, ['### SAMPLE TEXT ###'])
		currentDialogue?.push(new Choice(to, currentText))
		$dialogueTree = $dialogueTree
		currentText = ''
	}

	function remove(key: string, index: number) {
		if (key == currentBranch) {
			if (!currentDialogue) return
			currentDialogue.splice(index, 1)
			currentIndex = currentDialogue.length - 1
		} else {
			let clickedDialogue = $dialogueTree.get(key)
			if (!clickedDialogue) return
			clickedDialogue.splice(index, 1)
		}
		$dialogueTree = $dialogueTree
	}

	let expands = new Map<string, boolean>()

	function toggleExpandOf(key: string) {
		expands.set(key, !expands.get(key))
		expands = expands
	}

	// TODO: Guide
</script>

<svelte:window
	on:keydown={(e) => {
		if (!currentDialogue) return

		if (e.code == 'ArrowDown') {
			if (currentIndex + 1 == currentDialogue.length) {
				// jump to start
				currentIndex = 0
			} else {
				currentIndex++
			}
			return
		}

		if (e.code == 'ArrowUp') {
			if (currentIndex == 0) {
				// jump to end
				currentIndex = currentDialogue.length - 1
			} else {
				currentIndex--
			}
			return
		}
	}}
/>

<div
	class="flex h-[620px] flex-row items-start justify-center gap-4 2xl:h-[716px]"
>
	<!-- flex h-[620px] w-72 flex-col gap-4 rounded bg-base-200 p-8 2xl:h-[716px] 2xl:w-80 -->
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
				on:click={appendChoice}>ADD PLAYER CHOICE (SUBBRANCH)</button
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
		<div class="flex flex-row gap-4">
			<div class="flex-grow">
				<label for="main-branch" class="label">
					<span class="label-text"> Main Branches </span>
				</label>
				<select
					class="select-bordered select w-full"
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
					<span class="label-text"> Sibling Branches </span>
				</label>
				<select
					class="select-bordered select w-full"
					bind:value={currentBranch}
					on:change={branchChanged}
				>
					{#each siblingBranches as key}
						<option value={key}>{key}</option>
					{:else}
						<option value="" disabled>No subbranch</option>
					{/each}
				</select>
			</div>
		</div>
		<div class="flex flex-col items-start justify-start gap-2">
			{#each [...$dialogueTree] as [key, dialogue]}
				{#if key == currentBranch}
					{#each dialogue as text, i}
						{@const isString = typeof text == 'string'}
						<div class="flex w-full flex-row justify-between gap-1 pl-4">
							<button
								on:click={() => {
									currentBranch = key
									currentIndex = i
								}}
								class="flex-grow rounded bg-base-200 p-1 pl-2"
							>
								{#if key == currentBranch && currentIndex == i}📍&nbsp;{/if}
								{#if isString}{text}{:else}{text.text} -> {text.to}{/if}
							</button>
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
