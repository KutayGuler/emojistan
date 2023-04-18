<script lang="ts">
	import Consumable from '$rbx/Consumable.svelte';
	import Equippable from '$rbx/Equippable.svelte';
	import Interactable from '$rbx/Interactable.svelte';
	import Merger from '$rbx/Merger.svelte';
	import Pusher from '$rbx/Pusher.svelte';

	import Rulebox from '$lib/Rulebox.svelte';
	import {
		MERGER_BG,
		MERGER_H,
		MERGER_W,
		MERGER_BORDER,
		PUSHER_BG,
		PUSHER_H,
		PUSHER_W,
		PUSHER_BORDER,
		EQUIPPABLE_W,
		EQUIPPABLE_H,
		EQUIPPABLE_BG,
		EQUIPPABLE_BORDER,
		CONSUMABLE_W,
		CONSUMABLE_H,
		CONSUMABLE_BG,
		CONSUMABLE_BORDER,
		INTERACTABLE_W,
		INTERACTABLE_H,
		INTERACTABLE_BG,
		INTERACTABLE_BORDER,
	} from '$src/constants';
	import { onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	const ruleboxes = [
		{
			component: Pusher,
			rbx: {
				id: '0',
				type: 'pusher',
				position: { x: 0, y: 0 },
				width: PUSHER_W,
				height: PUSHER_H,
				bgColor: PUSHER_BG,
				borderColor: PUSHER_BORDER,
			},
		},
		{
			component: Merger,
			rbx: {
				id: '0',
				type: 'merger',
				position: { x: 0, y: 0 },
				width: MERGER_W,
				height: MERGER_H,
				bgColor: MERGER_BG,
				borderColor: MERGER_BORDER,
			},
		},
		{
			component: Equippable,
			rbx: {
				id: '0',
				type: 'equippable',
				position: { x: 0, y: 0 },
				width: EQUIPPABLE_W,
				height: EQUIPPABLE_H,
				bgColor: EQUIPPABLE_BG,
				borderColor: EQUIPPABLE_BORDER,
			},
		},
		{
			component: Consumable,
			rbx: {
				id: '0',
				type: 'consumable',
				position: { x: 0, y: 0 },
				width: CONSUMABLE_W,
				height: CONSUMABLE_H,
				bgColor: CONSUMABLE_BG,
				borderColor: CONSUMABLE_BORDER,
			},
		},
		{
			component: Interactable,
			rbx: {
				id: '0',
				type: 'interactable',
				position: { x: 0, y: 0 },
				width: INTERACTABLE_W,
				height: INTERACTABLE_H,
				bgColor: INTERACTABLE_BG,
				borderColor: INTERACTABLE_BORDER,
			},
		},
	];

	let index = 0;
	let interval = setInterval(() => {
		index += 1;
		if (index >= 5) {
			index = 0;
		}
	}, 1500);

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="self-start p-4">
	<h1 class="text-4xl">Ruleboxes</h1>
	<p class="w-1/2 pt-2">
		Ruleboxes are the fundamental elements that build the game logic. In the
		following tutorials, you will learn about each of those Ruleboxes.
	</p>
</div>

<div
	class="relative flex h-full w-full flex-col items-center justify-center gap-8 p-1"
>
	{#each ruleboxes as { rbx, component }, i}
		{#if index === i}
			<div
				in:fade
				style="width: {rbx.width}px; height: {rbx.height}px;"
				class="pointer-events-none relative flex flex-col justify-center"
			>
				<Rulebox {rbx}>
					<svelte:component this={component} />
				</Rulebox>
			</div>
		{/if}
	{/each}
</div>
