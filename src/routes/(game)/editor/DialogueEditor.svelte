<script lang="ts">
	import BranchViewer from './BranchViewer.svelte';
	import { interactables } from '$src/store';
	let currentBranch = '';

	const _interactables = [...$interactables].filter(
		([_, { emoji }]) => emoji != '' && emoji != undefined
	);
</script>

<main>
	<div
		class="flex h-[84vh] w-[90vw] flex-col items-start gap-2 overflow-y-auto px-4 md:h-[624px] md:w-[972px] 2xl:h-[720px] 2xl:w-[1068px]"
	>
		{#if _interactables.length > 0}
			<div class="flex flex-row items-center gap-2">
				<select
					class="select-bordered select"
					name="interactable"
					bind:value={currentBranch}
				>
					<option disabled value="">Choose an Interactable</option>
					{#each _interactables as [key, value]}
						<option value={key}>{value.emoji}</option>
					{/each}
				</select>
				<span class="flex w-full justify-start py-4 text-4xl">
					<i class="twa twa-{$interactables.get(currentBranch)?.emoji}" />
				</span>
			</div>
			<BranchViewer currentBranch={currentBranch.toString()} />
		{:else}
			<p class="text-xl">
				No dialogue here, create an Interactable at <i class="twa twa-books" /> to
				edit it's dialogue tree.
			</p>
		{/if}
	</div>
</main>
