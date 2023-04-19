<script lang="ts">
	import {
		INTERACTABLE_H,
		MIN_DURATION,
		MIN_INDEX,
		DEFAULT_SIDE_LENGTH,
		CROSS,
		MAX_SIDE_EFFECT,
		EFFECTOR_BORDER,
	} from '$src/constants';
	import { rbxStore } from '$src/lib/stores/store';
	import {
		Devolve,
		Evolve,
		Interactable,
		SequenceItem,
		type Mutations,
		type Drops,
	} from '$src/types';
	import { onDestroy, onMount } from 'svelte';
	import { notifications } from '../routes/notifications';
	import {
		map,
		formattedEmoji,
		interactables,
		effectors,
		type StringedNumber,
	} from '../store';

	let defaultBackground = $map.dbg;

	// Add Inventory: ["drop"]
	const types: {
		[key in 'Map' | 'Background' | 'Level']: Array<keyof Mutations>;
	} = {
		Map: ['spawn', 'destroy'],
		Background: ['paint', 'erase'],
		Level: ['resetLevel', 'completeLevel'],
	};

	const typeIcons = {
		Player: '👾',
		Map: '🗺️',
		Background: '🖌️',
		Level: '🎬',
	};

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

	// COMPONENT RELATED
	export let id: StringedNumber;
	export let emoji = '';
	export let sequence: Array<SequenceItem> = [];
	export let hp = 1;
	export let sideEffects: Array<[StringedNumber | 'any', number | 'talk']> = [
		['any', 'talk'],
	];
	export let pseudoSideEffects: Array<[StringedNumber | 'any', number]> = [];
	export let evolve = new Evolve('', 2);
	export let devolve = new Devolve('');
	export let drops: Drops = ['', 1];

	// SEQUENCE RELATED
	let type = types.Map[0];
	let duration = 0;
	let index = 0;
	let background = '';

	onMount(() => {
		console.log(id, $interactables);

		let obj = $interactables.get(id);
		if (obj) {
			({ emoji, sequence, hp, sideEffects, evolve, devolve, drops } = obj);
		}

		console.log(obj, sideEffects);
	});

	function updateStore() {
		interactables.update(
			id,
			new Interactable(emoji, sequence, hp, sideEffects, evolve, devolve, drops)
		);

		rbxStore.adjustHeight(id, sequence.length, INTERACTABLE_H);
	}

	onDestroy(() => {
		// if (emoji === '') {
		// 	interactables.remove(id);
		// 	rbxStore.remove(id);
		// 	return;
		// }

		sideEffects = sideEffects.filter((m) => {
			if (m[0] === 'any') return true;
			return $effectors.get(m[0])?.emoji != '';
		});
		sideEffects = sideEffects.filter((m, i) => {
			if (i === 0) return true;
			return m[1] != 0;
		});
		updateStore();
	});

	function addTosideEffects(effectorID: StringedNumber | 'any') {
		if (sideEffects.some(([id, val]) => id === effectorID)) return;
		if (sideEffects.length === MAX_SIDE_EFFECT) {
			notifications.warning(
				`Cannot have more than ${MAX_SIDE_EFFECT} side effects`
			);
			return;
		}
		sideEffects.push([effectorID, 0]);
		sideEffects = sideEffects;
		updateStore();
	}

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

	function removeEmptySideEffect(rbx: any, i: number) {
		sideEffects.splice(i, 1);
		sideEffects = sideEffects;
		updateStore();
	}

	function removeFromSideEffects(i: number) {
		sideEffects.splice(i, 1);
		sideEffects = sideEffects;
		updateStore();
	}

	function updateEmoji() {
		if (
			$formattedEmoji != '' &&
			[evolve.to, devolve.to].includes($formattedEmoji)
		) {
			notifications.warning(
				'An interactable cannot evolve or devolve to itself'
			);
			return;
		}

		for (let [_id, val] of $interactables.entries()) {
			if (_id === id) continue;

			if ($formattedEmoji === val.emoji) {
				notifications.warning('Cannot have two interactables with same emoji');
				return;
			}
		}

		for (let val of [...$effectors.values()]) {
			if (
				(typeof val === 'string' && val != '' && $formattedEmoji === val) ||
				(typeof val === 'object' && $formattedEmoji === val.emoji)
			) {
				notifications.warning(
					'An emoji can only have one assigned type. Interactable, Controllable or Effector'
				);
				return;
			}
		}

		emoji = $formattedEmoji;
		updateStore();
	}

	function updateEvolveEmoji() {
		if (emoji === $formattedEmoji) {
			notifications.warning('An interactable cannot evolve to itself');
			return;
		}

		evolve.to = $formattedEmoji;
		updateStore();
	}

	// this function deals with two-way binded variable
	function updateHP() {
		if (evolve.enabled && hp >= evolve.at) {
			notifications.warning(
				'Default HP cannot be bigger than or equal to evolve HP'
			);
			hp = evolve.at - 1;
		}

		updateStore();
	}

	// this function deals with two-way binded variable
	function updateEvolveHP() {
		if (evolve.at <= hp) {
			notifications.warning(
				'Evolve HP cannot be smaller than or equal to default HP'
			);
			evolve.at = hp + 1;
		}

		updateStore();
	}

	function updateDevolveEmoji() {
		if (emoji === $formattedEmoji) {
			notifications.warning('An interactable cannot devolve to itself');
			return;
		}

		devolve.to = $formattedEmoji;
		updateStore();
	}

	function updateSlot(i: number) {
		sequence[i].emoji = $formattedEmoji;
		updateStore();
	}

	function checkEvolve(e: any) {
		if (evolve.at < hp) {
			evolve.at = hp + 1;
		}
	}

	// TODO: main health cannot be higher than evolve's hp

	let hasInteraction = true;
	$: hasInteraction = sideEffects.some((m) => m[1] != 0);
	$: droppables = [...$effectors].filter(([id, e]) => e.emoji != '');
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
	<div class="flex scale-75 flex-col items-center justify-center">
		<button title="Devolve Emoji" class="slot-lg" on:click={updateDevolveEmoji}>
			<i class="twa twa-{devolve.to}" />
		</button>
		<div class="absolute -bottom-4">
			<select
				disabled
				class="select-bordered select select-sm text-xl"
				title="HP"
			>
				<option value={0}>0</option>
			</select>
		</div>
		<div class="absolute -bottom-12">Devolve</div>
	</div>
	<div class="flex flex-col items-center justify-center">
		<button title="Interactable Emoji" class="slot-lg" on:click={updateEmoji}>
			<i class="twa twa-{emoji}" />
		</button>
		<div class="absolute -bottom-4">
			<select
				class="select-bordered select select-sm text-xl"
				title="HP"
				bind:value={hp}
				on:change={updateHP}
			>
				{#each hps as _hp}
					<option value={_hp}>{_hp}</option>
				{/each}
			</select>
		</div>
	</div>
	<div
		use:checkEvolve
		class="flex scale-75 flex-col  items-center justify-center"
	>
		<button title="Evolve Emoji" class="slot-lg" on:click={updateEvolveEmoji}>
			<i class="twa twa-{evolve.to}" />
		</button>
		<div class="absolute -bottom-4">
			<select
				class="select-bordered select select-sm text-xl"
				title="HP"
				bind:value={evolve.at}
				on:change={updateEvolveHP}
			>
				{#each hps as _hp}
					<option value={_hp}>{_hp}</option>
				{/each}
			</select>
		</div>
		<div class="absolute -bottom-12">Evolve</div>
	</div>
</div>
<main class="flex w-full flex-col items-center justify-center gap-4 pt-16">
	<div class="flex w-full flex-col items-center justify-center p-4">
		<div class="divider w-full">DROPS</div>
		<div class="relative flex flex-col items-center justify-center">
			<div class="dropdown-right dropdown cursor-pointer">
				<label tabindex="0" class="slot-lg m-1"
					><i
						class="twa twa-{$effectors.get(drops[0])?.emoji ||
							$effectors.get(drops[0])?.emoji}"
					/></label
				>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box w-fit bg-base-100 p-2 shadow"
				>
					{#each droppables as [id, { emoji }]}
						<button
							class="w-fit rounded-md p-1 hover:bg-base-200"
							on:click={() => {
								drops[0] = id;
								updateStore();
							}}
						>
							<i class="twa twa-{emoji}" />
						</button>
					{:else}
						<div class="rounded-md p-1">No effectors defined.</div>
					{/each}
				</ul>
			</div>
			<div class="absolute -bottom-4">
				<select
					class="select-bordered select select-sm text-xl"
					title="HP"
					bind:value={drops[1]}
					on:change={() => {
						updateStore();
					}}
				>
					{#each [0, ...hps] as _hp}
						<option value={_hp}>{_hp}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
	<div class="form-control flex w-full flex-col p-4">
		<div class="divider flex flex-row pb-6">
			<p>SIDE EFFECTS ({sideEffects.length} / {MAX_SIDE_EFFECT})</p>
			<div class="dropdown-right dropdown">
				<label
					for=""
					tabindex="0"
					class="btn text-2xl"
					style:background={EFFECTOR_BORDER}>+</label
				>
				<ul
					tabindex="0"
					class="dropdown-content menu rounded-box bg-base-100 p-2 shadow "
				>
					{#each droppables as [id, { emoji }]}
						<button
							class="rounded-md p-1 hover:bg-base-200"
							on:click={() => addTosideEffects(id)}
						>
							<i class="twa twa-{emoji}" />
						</button>
					{:else}
						<div class="rounded-md p-1">No effectors defined.</div>
					{/each}
				</ul>
			</div>
		</div>
		{#if !hasInteraction}
			<p class="text-error">
				An interactable needs at least one side effect with positive or negative
				value to be interactable!
			</p>
		{/if}
		<div class="flex items-center justify-center px-12">
			<div class="flex w-fit flex-wrap items-start justify-start gap-8">
				{#each sideEffects as [effectorID, value], i}
					{@const modifierEmoji = $effectors.get(effectorID)?.emoji}
					<div class="relative flex flex-col items-center">
						{#if effectorID === 'any'}
							<div class="slot-lg scale-75">
								{effectorID}
							</div>
							<select
								class="select-bordered select select-sm absolute -bottom-4"
								bind:value
								on:change={updateStore}
							>
								{#each modifierPoints as point}
									<option value={point}
										>{typeof point === 'number' && point > 0
											? `+${point}`
											: point}</option
									>
								{/each}
							</select>
						{:else if modifierEmoji}
							<button
								class="absolute -top-2 -right-2 text-lg"
								on:click={() => removeFromSideEffects(i)}>{CROSS}</button
							>
							<div class="slot-lg scale-75">
								<i class="twa twa-{modifierEmoji}" />
							</div>
							<select
								class="select-bordered select select-sm absolute -bottom-4"
								bind:value
								on:change={updateStore}
							>
								{#each modifierPoints as point}
									<option value={point}
										>{typeof point === 'number' && point > 0
											? `+${point}`
											: point}</option
									>
								{/each}
							</select>
						{:else}
							<div use:removeEmptySideEffect={i} />
						{/if}
					</div>
				{/each}
				{#each pseudoSideEffects as [emoji, value]}
					<div class="relative flex flex-col items-center">
						<button class="absolute -top-2 -right-2 text-lg">{CROSS}</button>
						<div class="slot-lg scale-75">
							<i class="twa twa-{emoji}" />
						</div>
						<select class="select-bordered select select-sm absolute -bottom-4">
							<option selected {value}>{value}</option>
							<option value="+100">+100</option>
						</select>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<!-- <div class="flex w-full flex-col gap-2 p-4">
		<div class="divider">EVENT SEQUENCE</div>
		{#each sequence as s, i}
			<span class="flex w-full flex-row items-start justify-center gap-2">
				<select
					class="select-bordered select"
					title="event type"
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
				{:else if s.type === 'wait'}
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
					</select>
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
				title="event type"
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
	</div> -->
</main>

<style>
	.enabled {
		opacity: 1;
	}
</style>
