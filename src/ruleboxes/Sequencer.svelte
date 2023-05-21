<script lang="ts">
	import {
		MIN_INDEX,
		MIN_DURATION,
		CROSS,
		palette,
		DEFAULT_SIDE_LENGTH,
		INTERACTABLE_H,
	} from '$src/constants';
	import { rbxStore } from '$src/lib/stores/store';
	import {
		map,
		formattedEmoji,
		type StringedNumber,
		sequencers,
	} from '$src/store';
	import { SequenceItem, type Actions, Sequencer } from '$src/types';
	import { onMount } from 'svelte/internal';

	export let id: StringedNumber;
	export let sequence: Array<SequenceItem> = [];

	onMount(() => {
		let obj = $sequencers.get(id);
		if (obj) {
			({ sequence } = obj);
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
		[key in 'Map' | 'Background' | 'Game']: Array<keyof Actions>;
	} = {
		Map: ['spawn', 'spawnRTP', 'destroy'],
		Background: ['paint', 'erase'],
		Game: ['reset', 'complete'],
	};

	const typeDescriptions: { [key in keyof Actions]: string } = {
		// TODO: type descriptions
		paint: 'paint string',
		erase: 'erase string',
		spawn: 'spawn string',
		spawnRTP:
			'spawnRTP\n\nGiven player is the origin (x: 0, y: 0); provide X and Y values to spawn an object relative to player.',
		destroy: 'destroy string',
		reset: 'reset string',
		complete: 'complete string',
	};

	const typeIcons: {
		[key in 'Map' | 'Background' | 'Game']: string;
	} = {
		// Player: '👾',
		Map: '🗺️',
		Background: '🖌️',
		Game: '🎬',
	};

	// SEQUENCE RELATED
	let type = types.Map[0];
	let duration = 0;
	let index = 0;
	let background = '';

	function addToSequence() {
		sequence = [
			...sequence,
			new SequenceItem(type, MIN_INDEX, '', 1, MIN_DURATION, ''),
		];
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
		sequencers.update(id, new Sequencer(sequence));
		rbxStore.adjustHeight(id, sequence.length, INTERACTABLE_H);
	}
</script>

<div class="flex w-full flex-col gap-2 p-4">
	<div class="divider">EVENT SEQUENCE</div>
	{#each sequence as s, i}
		<span class="flex w-full flex-row items-start justify-center gap-2">
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
