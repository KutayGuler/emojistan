<script lang="ts">
	export let tree;
	export let currentBranch: Array<any> = [];
	export let nextBranch = '';
</script>

{#each currentBranch as leaf}
	{@const isChoice = Array.isArray(leaf)}
	{#if isChoice}
		{#each leaf as choice}
			<label>
				{choice.label}
				<input
					type="radio"
					name="choice"
					value={choice.label}
					bind:group={nextBranch}
				/>
			</label>
		{/each}
	{:else}
		<p>{leaf}</p>
	{/if}
{/each}

{#if tree[nextBranch]}
	<svelte:self {tree} currentBranch={nextBranch} />
{/if}
