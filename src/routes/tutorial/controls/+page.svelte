<script lang="ts">
	import { Choice, EditableMap, Equippable } from '$src/types';
	import Game from '$src/views/Game.svelte';

	const gameProps = {
		map: new EditableMap(
			new Map<string, string>([
				['155_5', 'woman-walking'],
				['155_6', 'dog'],
				['155_11', 'bone'],
			]),
			-2
		),
		// dt: new Map<string, Array<string | Choice>>([
		//   ["dog", ]
		//   ["human", ]
		// ]),
		equippables: new Map<number, Equippable>([[1, new Equippable('🦴', 1)]]),
		mapClass: 'simulation',
		SIZE: 4,
	};
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
			<p>Change Player</p>
			<div class="flex w-full justify-center gap-2">
				<kbd class="kbd">Q</kbd>
				<kbd class="kbd">E</kbd>
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
			<p>Change Item</p>
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
