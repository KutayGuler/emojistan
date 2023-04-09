<script lang="ts">
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

	// TODO: shouldn't be able to add choice as first element
</script>

<div class="flex w-full flex-col gap-2">
	{#if currentBranch}
		<div class="flex flex-row gap-2">
			<input class="input-bordered input" bind:value={text} />
			<button class="btn" on:click={addText}>ADD AS TEXT</button>
			<button
				disabled={$dialogueTree.get(currentBranch)?.at(-1)?.length == 4}
				class="btn"
				on:click={addChoice}>ADD AS CHOICE</button
			>
		</div>
	{/if}

	{#if $dialogueTree.get(currentBranch)}
		{@const branch = $dialogueTree.get(currentBranch)}
		<div class="mb-2 w-full rounded border-2 border-black p-4">
			{#each branch as leaf}
				{@const isString = typeof leaf === 'string'}
				{#if isString}
					<div>{leaf}</div>
				{:else}
					<div class="mt-4 flex flex-row items-center gap-2">
						{#each leaf as choice}
							<button
								class="btn {choice.next == nextBranch
									? 'btn-primary'
									: ''} flex-grow"
								on:click={() => toggleNextBranch(choice.next)}
								>{choice.label}</button
							>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	{#if $dialogueTree.has(nextBranch)}
		<svelte:self currentBranch={nextBranch} />
	{/if}
</div>
