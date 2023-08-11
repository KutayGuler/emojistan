<script lang="ts">
	import {
		MIN_INDEX,
		CROSS,
		palette,
		DEFAULT_SIDE_LENGTH,
		SEQUENCER_H,
	} from '$src/constants';
	import { rbxStore } from '$src/lib/stores/store';
	import { notifications } from '$src/routes/notifications';
	import {
		map,
		formattedEmoji,
		sequencers,
		type StringedNumber,
		effectors,
	} from '$src/store';
	import { SequenceItem, type SequenceActions, Sequencer } from '$src/types';
	import { onMount } from 'svelte/internal';

	export let id: StringedNumber;
	export let name: string;
	export let sequence: Array<SequenceItem> = [];

	onMount(() => {
		let obj = $sequencers.get(id);
		if (obj) {
			({ name, sequence } = obj);
		}
	});

	let defaultBackground = $map.dbg;

	let indexes: Array<number> = [];
	let hps: Array<number> = [];
	let modifierPoints: Array<number | 'talk'> = [];

	for (let i = 0; i < 100; i++) {
		hps[i] = i + 1;
		modifierPoints[i] = i + 1;
	}

	modifierPoints.unshift('talk');

	for (let i = 0; i >= -100; i--) {
		modifierPoints.unshift(i);
	}

	for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
		indexes[i] = i;
	}

	const types: {
		[key in 'Map' | 'Background' | 'Game' | 'Inventory']: Array<
			keyof SequenceActions
		>;
	} = {
		Map: ['spawn', 'destroy'], // 'spawnRTP'
		Background: ['paint', 'erase'],
		Game: ['reset', 'complete'],
		Inventory: ['drop'],
	};

	const typeDescriptions: { [key in keyof SequenceActions]: string } = {
		paint: 'paint\n\nPaint the specificied cell in the current section.',
		erase:
			'erase\n\nErase a color from the specified cell in the current section.',
		spawn: 'spawn\n\nSpawn an emoji in the specified cell.',
		// spawnRTP:
		// 	'spawnRTP\n\nGiven player is the origin (x: 0, y: 0);\nprovide X and Y values to spawn an object relative to player.',
		destroy: 'destory\n\nDestroy the emoji in the specified cell.',
		reset: 'reset\n\nReset the game state to default.',
		complete: 'complete\n\nComplete the game.',
		drop: 'drop\n\nDrop an item to players inventory.',
	};

	const typeIcons: {
		[key in 'Map' | 'Background' | 'Game' | 'Inventory']: string;
	} = {
		// Player: '👾',
		Map: '🗺️',
		Background: '🖌️',
		Game: '🎬',
		Inventory: '🎒',
	};

	// SEQUENCE RELATED
	let type = types.Map[0];
	let duration = 0;
	let index = 0;
	let background = '';

	function addToSequence() {
		sequence = [...sequence, new SequenceItem(type, MIN_INDEX, '', 1, '')];
		updateStore();
		[type, duration, index, background] = [types.Map[0], 0, 0, ''];
	}

	function removeFromSequence(i: number) {
		sequence.splice(i, 1);
		sequence = sequence;
		updateStore();
	}

	function updateSlot(i: number) {
		sequence[i].emoji = $formattedEmoji;
		updateStore();
	}

	function updateStore() {
		sequencers.update(id, new Sequencer(name, sequence));
		rbxStore.adjustHeight(id, sequence.length, SEQUENCER_H);
	}

	let openNameEdit = false;
	let nameInput = '';

	function changeName() {
		if (nameInput == '') {
			notifications.warning('Sequencer name cannot be empty');
			return;
		}

		name = nameInput;
		updateStore();
		openNameEdit = false;
	}

	$: droppables = [...$effectors].filter(([id, e]) => e.emoji != '');
</script>

<div class="flex w-full flex-col gap-2 p-4">
	<div class="divider">
		{#if openNameEdit}
			<form class="flex flex-row items-center gap-2" on:submit={changeName}>
				<input
					class="input-bordered input input-sm"
					type="text"
					bind:value={nameInput}
				/>
				<button
					type="submit"
					title="Change name"
					class="btn-sm btn w-fit self-center"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4.5 12.75l6 6 9-13.5"
						/>
					</svg></button
				>
			</form>
		{:else}
			{name}
			<button
				on:click={() => {
					nameInput = name;
					openNameEdit = true;
				}}
				title="Change name"
				class="btn-xs btn w-fit self-center"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-4 w-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
					/>
				</svg></button
			>
		{/if}
	</div>
	{#each sequence as s, i}
		<span class="flex w-full flex-row items-center justify-center gap-2">
			<select
				class="select-bordered select"
				title={typeDescriptions[s.type]}
				bind:value={s.type}
			>
				{#each Object.entries(types) as [group, values]}
					<optgroup label={`${group} ${typeIcons[group]}`}>
						{#each values as t}
							<option value={t}>{t}</option>
						{/each}
					</optgroup>
				{/each}
			</select>
			{#if s.type === 'spawn'}
				<button class="slot" on:click={() => updateSlot(i)}>
					<i class="twa twa-{s.emoji}" />
				</button>
				at
				<select
					class="select-bordered select"
					title="index"
					id="index"
					bind:value={s.index}
					on:change={updateStore}
				>
					{#each indexes as j}
						<option value={j}>{j}</option>
					{/each}
				</select>
			{:else if s.type === 'drop'}
				<button class="slot" on:click={() => updateSlot(i)}>
					<i class="twa twa-{s.emoji}" />
				</button>
				{CROSS}
				<select
					class="select-bordered select"
					title="index"
					id="index"
					bind:value={s.index}
					on:change={updateStore}
				>
					{#each [1, 2, 3, 4, 5, 6, 7, 8] as j}
						<option value={j}>{j}</option>
					{/each}
					<!-- TODO: turn this into droppables -->
				</select>
			{:else if s.type === 'destroy' || s.type === 'erase'}
				<select
					class="select-bordered select"
					title="index"
					id="index"
					bind:value={s.index}
					on:change={updateStore}
				>
					{#each indexes as j}
						<option value={j}>{j}</option>
					{/each}
				</select>
				<!-- {:else if s.type === 'wait'}
				<select
					class="select-bordered select"
					title="duration"
					id="duration"
					bind:value={s.duration}
					on:change={updateStore}
				>
					{#each DURATIONS as d}
						<option value={d}>{d}</option>
					{/each}
				</select> -->
			{:else if s.type === 'paint'}
				<select
					class="select-bordered select"
					title="index"
					id="index"
					bind:value={s.index}
					on:change={updateStore}
				>
					{#each indexes as j}
						<option value={j}>{j}</option>
					{/each}
				</select>
				to
				<select
					class="select-bordered select"
					title="color"
					bind:value={s.background}
					style:background={s.background}
					on:change={updateStore}
				>
					{#each palette.filter((color) => color != defaultBackground) as color}
						<option value={color} style:background={color} />
					{/each}
				</select>
			{/if}
			<div class="flex flex-grow justify-end">
				<button
					class="text-2xl"
					id="remove"
					on:click={() => removeFromSequence(i)}>{CROSS}</button
				>
			</div>
		</span>
	{/each}
	<label class="flex items-center justify-center gap-2">
		<select
			class="select-bordered select"
			title={typeDescriptions[type]}
			bind:value={type}
		>
			{#each Object.entries(types) as [group, values]}
				<optgroup label={`${group} ${typeIcons[group]}`}>
					{#each values as t}
						<option value={t}>{t}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
		<button class="btn text-2xl" on:click={addToSequence}>+</button>
	</label>
</div>
