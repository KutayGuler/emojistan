<script lang="ts">
	import { DEFAULT_SIDE_LENGTH } from '$src/constants';
	import { currentEmoji, currentColor, map, formattedEmoji } from '../store';

	export let sectionIndex = 0;
	export let copyMode: 'Item' | 'Background' | 'Both';

	function clickedCell(index: number) {
		switch (copyMode) {
			case 'Item':
				if ($currentEmoji == '') map.removeEmoji(sectionIndex, index);
				break;
			case 'Background':
				if ($currentColor == '') map.deleteBackground(sectionIndex, index);
				break;
			case 'Both':
				if ($currentColor == '') map.deleteBackground(sectionIndex, index);
				if ($currentEmoji == '') map.removeEmoji(sectionIndex, index);
				break;
		}

		if ($currentColor != '' && $currentColor != $map.dbg) {
			map.updateBackground(sectionIndex, index, $currentColor);
		}

		if ($currentEmoji != '') {
			map.addEmoji(sectionIndex, index, $formattedEmoji);
		}
	}

	function rightClickedCell(index: number) {
		let key = sectionIndex + '_' + index;
		switch (copyMode) {
			case 'Item':
				$currentEmoji = $map.items.get(key) || '';
				break;
			case 'Background':
				$currentColor = $map.backgrounds.get(key) || '';
				break;
			case 'Both':
				$currentEmoji = $map.items.get(key) || '';
				$currentColor = $map.backgrounds.get(key) || '';
				break;
		}
	}

	let holding = false;

	function mouseEnter(index: number) {
		if (holding) clickedCell(index);
	}
</script>

<svelte:window
	on:mousedown={() => (holding = true)}
	on:mouseup={() => (holding = false)}
/>

<div class="map">
	{#each { length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH } as _, i}
		{@const key = sectionIndex + '_' + i}
		{@const mapItem = $map?.items.get(key)}
		<button
			title="Cell #{i}"
			style:background={$map.backgrounds.get(key) || $map.dbg}
			on:mouseenter={() => mouseEnter(i)}
			on:click={() => clickedCell(i)}
			on:contextmenu|preventDefault={() => rightClickedCell(i)}
		>
			{#if mapItem}
				<i class="twa twa-{mapItem}" />
			{/if}
		</button>
	{/each}
</div>
