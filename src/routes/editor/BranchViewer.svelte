<script lang="ts">
	import { CROSS } from '$src/constants';
	import { dialogueTree } from '$src/store';
	export let currentBranch = '';
	export let nextBranch = '';
	let text = '';

	function toggleNextBranch(next: string) {
		nextBranch = nextBranch === next ? '' : next;
	}

	function addChoice() {
		if (text == '') return;
		dialogueTree.addChoiceTo(currentBranch, text);
		text = '';
	}

	function addText() {
		if (text == '') return;
		dialogueTree.addTextTo(currentBranch, text);
		text = '';
	}

	$: if (currentBranch !== '' && !$dialogueTree.has(currentBranch)) {
		dialogueTree.add(currentBranch);
		break $;
	}

	$: choiceDisabled =
		$dialogueTree.get(currentBranch)?.length == 0 ||
		$dialogueTree.get(currentBranch)?.at(-1)?.length == 4;

	let showEditIndex = -1;
	let editValue = '';

	function openEdit() {}
</script>

<svelte:window
	on:keypress={(e) => {
		if (e.code == 'Escape') {
			showEditIndex = -1;
			editValue = '';
		}
	}}
/>

<!-- TODO: change label and text content of choices -->

<div class="flex w-full flex-col gap-2">
	{#if $dialogueTree.get(currentBranch)}
		{@const branch = $dialogueTree.get(currentBranch)}
		<div class="mb-2 w-full rounded border-2 border-black p-4">
			<div class="mb-4 flex flex-row gap-2">
				<input class="input-bordered input w-full" bind:value={text} />
				<button class="btn" on:click={addText}>ADD AS TEXT</button>
				<button disabled={choiceDisabled} class="btn" on:click={addChoice}
					>ADD AS CHOICE</button
				>
			</div>
			{#each branch as leaf, i}
				{@const isString = typeof leaf === 'string'}
				{#if isString}
					<div class="flex flex-row items-start gap-2">
						<button>{CROSS}</button>
						<button
							class="h-6"
							on:click={() => {
								// @ts-expect-error
								editValue = leaf;
								if (showEditIndex == i) {
									showEditIndex = -1;
								} else {
									showEditIndex = i;
								}
							}}
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-3 w-3"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
								/>
							</svg>
						</button>
						{#if showEditIndex == i}
							<form
								on:submit={() => {
									// TODO: update array
									showEditIndex = -1;
								}}
							>
								<input
									class="input-bordered input input-sm"
									type="text"
									bind:value={editValue}
								/>
							</form>
						{:else}
							<p>{leaf}</p>
						{/if}
					</div>
				{:else}
					<div class="mt-4 flex flex-row items-center gap-2">
						{#each leaf as choice}
							{@const chosen = choice.next == nextBranch}
							<!-- <button
								class="btn {choice.next == nextBranch
									? 'btn-primary'
									: ''} flex-grow"
								on:click={() => toggleNextBranch(choice.next)}
								>{choice.label}</button
							> -->
							<div
								class="flex w-1/4 flex-col gap-2 rounded-xl border-2 {chosen
									? 'border-primary'
									: 'border-black'}"
							>
								<button
									class="btn {chosen ? 'btn-primary' : ''} flex-grow"
									on:click={() => toggleNextBranch(choice.next)}
									>{choice.label}</button
								>
								<p class="h-20 overflow-y-auto p-1">{choice.text}</p>
								<!-- <button
									class="btn {choice.next == nextBranch
										? 'btn-primary'
										: ''} flex-grow"
									on:click={() => toggleNextBranch(choice.next)}>Show</button
								> -->
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

{#if $dialogueTree.has(nextBranch)}
	<svelte:self currentBranch={nextBranch} />
{/if}
