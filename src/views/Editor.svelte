<script lang="ts">
	import { DEFAULT_SIDE_LENGTH } from '$src/constants';
	import type { CopyMode } from '$src/types';
	import {
		currentEmoji,
		currentColor,
		map,
		formattedEmoji,
		recentlyUsed,
	} from '../store';

	export let sectionIndex = 0;
	export let copyMode: CopyMode;
	export let emojiMode: 'Foreground' | 'Background';

	function clickedCell(index: number) {
		if (emojiMode[0] === 'F') {
			switch (copyMode) {
				case 'Emoji':
					if ($currentEmoji === '') map.removeEmoji(sectionIndex, index);
					break;
				case 'Color':
					if ($currentColor === '') map.deleteColorAt(sectionIndex, index);
					break;
				case 'Both':
					if ($currentColor === '') map.deleteColorAt(sectionIndex, index);
					if ($currentEmoji === '') map.removeEmoji(sectionIndex, index);
					break;
			}

			if ($currentEmoji != '') {
				map.addEmoji(sectionIndex, index, $formattedEmoji);
			}

			if ($currentColor != '' && $currentColor != $map.dbg) {
				map.updateColorAt(sectionIndex, index, $currentColor);
			}
		} else {
			if ($currentEmoji === '') {
				map.deleteBackgroundAt(sectionIndex, index);
			} else {
				map.updateBackgroundAt(sectionIndex, index, $currentEmoji);
			}

			if ($currentColor != '' && $currentColor != $map.dbg) {
				map.updateColorAt(sectionIndex, index, $currentColor);
			}
		}
	}

	function rightClickedCell(index: number) {
		let key = sectionIndex + '_' + index;
		let emoji = $map.items.get(key) || '';
		switch (copyMode) {
			case 'Emoji':
				$currentEmoji = emoji;
				recentlyUsed.add(emoji);
				break;
			case 'Color':
				$currentColor = $map.colors.get(key) || '';
				break;
			case 'Both':
				$currentEmoji = emoji;
				$currentColor = $map.colors.get(key) || '';
				recentlyUsed.add(emoji);
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

<div class="badge absolute -top-8 right-80">
	Section #{sectionIndex}
</div>

<div class="map">
	{#each { length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH } as _, i}
		{@const key = sectionIndex + '_' + i}
		{@const mapItem = $map?.items.get(key)}
		{@const background = $map?.backgrounds.get(key)}
		<button
			title="Cell #{i}"
			style:background={$map.colors.get(key) || $map.dbg}
			on:mouseenter={() => mouseEnter(i)}
			on:click={() => clickedCell(i)}
			on:contextmenu|preventDefault={() => rightClickedCell(i)}
		>
			{#if mapItem}
				<i class="twa z-10 twa-{mapItem}" />
			{:else if background}
				<i
					class="twa absolute scale-75
					text-center opacity-50 twa-{background}"
				/>
			{/if}
		</button>
	{/each}
</div>
