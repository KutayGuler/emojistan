<script lang="ts">
	import { Choice } from '$src/types';
	import BranchViewer from './BranchViewer.svelte';

	const tree = {
		'grinning-face': [
			'stuff',
			'stuff',
			[new Choice('yes', 'hell yeah', 'lol')],
		],
		lol: ['lolski', [new Choice('yes', 'hell yeah', 'wow')]],
		wow: ['wowski'],
	};

	let nextBranch = '';
	let interactable = 'grinning-face';
	let currentBranch: Array<any> = [];
	$: currentBranch = tree[interactable];
</script>

<select name="interactable" bind:value={interactable}>
	{#each Object.keys(tree) as value}
		<option {value}>{value}</option>
	{/each}
</select>

<BranchViewer {tree} {currentBranch} />
