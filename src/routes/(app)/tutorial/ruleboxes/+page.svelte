<script lang="ts">
	import Effector from '$rbx/Effector.svelte';
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
		EFFECTOR_W,
		EFFECTOR_H,
		EFFECTOR_BG,
		EFFECTOR_BORDER,
		INTERACTABLE_W,
		INTERACTABLE_H,
		INTERACTABLE_BG,
		INTERACTABLE_BORDER,
		CONTROLLABLE_BORDER,
		CONTROLLABLE_BG,
		CONTROLLABLE_H,
		CONTROLLABLE_W,
	} from '$src/constants';
	import { onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Controllable from '$rbx/Controllable.svelte';

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
			component: Effector,
			rbx: {
				id: '0',
				type: 'effector',
				position: { x: 0, y: 0 },
				width: EFFECTOR_W,
				height: EFFECTOR_H,
				bgColor: EFFECTOR_BG,
				borderColor: EFFECTOR_BORDER,
			},
		},
		{
			component: Controllable,
			rbx: {
				id: '-1',
				type: 'controllable',
				position: { x: 0, y: 0 },
				width: CONTROLLABLE_W,
				height: CONTROLLABLE_H,
				bgColor: CONTROLLABLE_BG,
				borderColor: CONTROLLABLE_BORDER,
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

<div class="self-start">
	<h1 class="text-6xl">Ruleboxes</h1>
	<p class="w-1/2 pt-2">
		Ruleboxes are the fundamental elements that build the game logic. In the
		following tutorials, you will learn about each of those Ruleboxes.
	</p>
</div>

<div class="relative flex h-full flex-col items-center justify-center pb-4">
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
