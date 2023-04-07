<script lang="ts">
	import { dialogueTree } from '$src/store';
	import { onMount } from 'svelte';
	export let currentBranch = '';
	export let nextBranch = '';

	let text = '';

	function toggleNextBranch(next: string) {
		nextBranch = nextBranch === next ? '' : next;
	}

	function addChoice() {
		dialogueTree.addChoiceTo(currentBranch, text);
	}

	function addText() {
		dialogueTree.addTextTo(currentBranch, text);
	}

	onMount(() => {
		if (currentBranch !== '' && !$dialogueTree.has(currentBranch)) {
			dialogueTree.add();
		}
	});
</script>

<div class="flex flex-row gap-2">
	<input class="input-bordered input" bind:value={text} />
	<button class="btn" on:click={addText}>ADD AS TEXT</button>
	<button class="btn" on:click={addChoice}>ADD AS CHOICE</button>
</div>

{#if $dialogueTree.get(currentBranch)}
	{@const branch = $dialogueTree.get(currentBranch)}
	<div class="mb-2 w-full rounded border-2 border-black p-4">
		{#each branch as leaf}
			{@const isString = typeof leaf === 'string'}
			{#if isString}
				<div>{leaf}</div>
			{:else}
				<div class="flex flex-row items-center gap-2">
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
