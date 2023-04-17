<script lang="ts">
	import { dialogueTree } from '$src/store';
	import {
		Choice,
		Controllable,
		Devolve,
		EditableMap,
		Consumable,
		Evolve,
		Interactable,
	} from '$src/types';
	import Game from '$src/views/Game.svelte';
	import { onDestroy } from 'svelte';

	$dialogueTree.set('dog', ['woof']);

	// TODO: change example

	const gameProps = {
		map: new EditableMap(
			new Map<string, string>([
				['0_5', 'woman-walking'],
				['0_6', 'dog'],
				['0_11', 'bone'],
			])
		),
		controllables: new Map<number, Controllable>([
			[
				0,
				new Controllable(
					'woman-walking',
					1,
					[['any', 0]],
					new Evolve(false, '', 0),
					new Devolve(false, '')
				),
			],
		]),
		interactables: new Map<number, Interactable>([
			[
				0,
				new Interactable(
					'dog',
					[],
					1,
					1,
					[['any', 1]],
					new Evolve(false, '', 0),
					new Devolve(false, '')
				),
			],
		]),
		dt: new Map<string, Array<string | Choice>>([
			['dog', ['woof']],
			['woman-walking', ['lololo']],
		]),
		consumables: new Map<number, Consumable>([[1, new Consumable('bone', 1)]]),
		mapClass: 'simulation',
		SIZE: 4,
	};

	console.log($dialogueTree);

	onDestroy(() => {
		$dialogueTree.delete('dog');
	});
</script>

<div
	class="relative flex h-full w-full flex-row items-center justify-center gap-4"
>
	<div class="flex w-full flex-col gap-12">
		<h1 class="absolute top-0 left-0 p-4 text-4xl">Controls</h1>
		<div class="flex flex-col items-center justify-center">
			<p>Movement</p>
			<div class="flex w-full justify-center">
				<kbd class="kbd">▲</kbd>
			</div>
			<div class="flex w-full justify-center">
				<kbd class="kbd">◀︎</kbd>
				<kbd class="kbd">▼</kbd>
				<kbd class="kbd">▶︎</kbd>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>Change Direction</p>
			<div class="flex w-full justify-center">
				<kbd class="kbd">W</kbd>
			</div>
			<div class="flex w-full justify-center">
				<kbd class="kbd">A</kbd>
				<kbd class="kbd">S</kbd>
				<kbd class="kbd">D</kbd>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>Switch Player</p>
			<div class="flex w-full justify-center gap-2">
				<kbd class="kbd">R</kbd>
			</div>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>Interact</p>
			<kbd class="kbd px-12">Space</kbd>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>Drop Item</p>
			<kbd class="kbd">Ctrl</kbd>
		</div>
		<div class="flex flex-col items-center justify-center">
			<p>Change Equipped Item</p>
			<div class="flex w-full justify-center gap-2">
				<kbd class="kbd">1</kbd>
				<kbd class="kbd">2</kbd>
				<kbd class="kbd">3</kbd>
				<kbd class="kbd">4</kbd>
			</div>
		</div>
	</div>
	<div class="relative flex w-full flex-col items-center justify-center">
		<Game {...gameProps} />
	</div>
</div>
