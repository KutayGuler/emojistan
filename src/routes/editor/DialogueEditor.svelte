<script lang="ts">
	import BranchViewer from './BranchViewer.svelte';
	import { interactables } from '$src/store';
	let currentBranch = '';
</script>

<div
	class="flex h-[624px] w-[972px] flex-col items-start justify-center 2xl:h-[716px] 2xl:w-[1068px]"
>
	<div class="flex flex-row items-center gap-2">
		<select
			class="select-bordered select"
			name="interactable"
			bind:value={currentBranch}
		>
			{#each [...$interactables].filter(([_, { emoji }]) => emoji != '') as [key, value]}
				<option value={key}>{value.emoji}</option>
			{/each}
		</select>
		<span class="flex w-full justify-start py-4 text-4xl">
			<i class="twa twa-{$interactables.get(currentBranch)?.emoji}" />
		</span>
	</div>

	<BranchViewer currentBranch={currentBranch.toString()} />
</div>
