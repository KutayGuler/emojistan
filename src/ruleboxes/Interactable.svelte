<script lang="ts">
	import {
		DEFAULT_SIDE_LENGTH,
		CROSS,
		MAX_SIDE_EFFECT,
		EFFECTOR_BORDER,
	} from '$src/constants';
	import {
		Devolve,
		Evolve,
		Interactable,
		type Drops,
		type SideEffect,
		type MapLocation,
	} from '$src/types';
	import { onDestroy, onMount } from 'svelte';
	import { notifications } from '../routes/notifications';
	import {
		formattedEmoji,
		interactables,
		effectors,
		type StringedNumber,
		sequencers,
	} from '../store';
	import { hasDuplicateIn, hasDuplicate } from './utils';

	let indexes: Array<number> = [];
	let hps: Array<number> = [];
	let modifierPoints: Array<SideEffect> = [];

	for (let i = 0; i < 100; i++) {
		hps[i] = i + 1;
		modifierPoints[i] = i + 1;
	}

	modifierPoints.unshift('trigger');
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
	export let sequenceID: StringedNumber = '-1';
	export let hp = 1;
	export let sideEffects: Array<[StringedNumber | 'any', SideEffect]> = [
		['any', 'talk'],
	];
	export let triggers: Array<[StringedNumber | 'any', StringedNumber]> = [];
	export let pseudoSideEffects: Array<[string | 'any', number]> = [];
	export let evolve = new Evolve('', 2);
	export let devolve = new Devolve('');
	export let drops: Drops = ['-1', 1];

	onMount(() => {
		let obj = $interactables.get(id);
		if (obj) {
			({
				emoji,
				sequenceID,
				hp,
				sideEffects,
				triggers,
				evolve,
				devolve,
				drops,
			} = obj);
		}
	});

	function updateStore() {
		console.log(triggers);
		interactables.update(
			id,
			new Interactable(
				emoji,
				sequenceID,
				hp,
				sideEffects,
				triggers,
				evolve,
				devolve,
				drops
			)
		);
	}

	onDestroy(() => {
		// if (emoji === '') {
		// 	interactables.remove(id);
		// 	rbxStore.remove(id);
		// 	return;
		// }

		// sideEffects = sideEffects.filter((m) => {
		// 	if (m[0] === 'any') return true;
		// 	return $effectors.get(m[0])?.emoji != '';
		// });
		// sideEffects = sideEffects.filter((m, i) => {
		// 	if (i === 0) return true;
		// 	return m[1] != 0;
		// });
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

		if (
			hasDuplicateIn<Interactable>(id, interactables, 'interactable') ||
			hasDuplicate()
		) {
			return;
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

	function updateDevolveEmoji() {
		if (emoji === $formattedEmoji) {
			notifications.warning('An interactable cannot devolve to itself');
			return;
		}

		devolve.to = $formattedEmoji;
		updateStore();
	}

	function checkEvolve(e: any) {
		if (evolve.at < hp) {
			evolve.at = hp + 1;
		}
	}

	let hasInteraction = true;
	$: hasInteraction = sideEffects.some((m) => m[1] != 0);
	$: droppables = [...$effectors].filter(([id, e]) => e.emoji != '');
	$: evolve.at = hp > evolve.at ? hp + 1 : evolve.at;

	// TODO: change sideEffects to [effectorID, value, triggerID]
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
				on:change={updateStore}
			>
				{#each hps as _hp}
					<option value={_hp}>{_hp}</option>
				{/each}
			</select>
		</div>
	</div>
	<div
		use:checkEvolve
		class="flex scale-75 flex-col items-center justify-center"
	>
		<button title="Evolve Emoji" class="slot-lg" on:click={updateEvolveEmoji}>
			<i class="twa twa-{evolve.to}" />
		</button>
		<div class="absolute -bottom-4">
			<select
				class="select-bordered select select-sm text-xl"
				title="HP"
				bind:value={evolve.at}
				on:change={updateStore}
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
	<div class="form-control flex w-full flex-col p-4">
		<div class="divider flex flex-row pb-6">
			<p>SIDE EFFECTS ({sideEffects.length} / {MAX_SIDE_EFFECT})</p>
			{#if emoji}
				<div class="dropdown-right dropdown">
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<label
						for=""
						tabindex="0"
						class="btn text-2xl {emoji
							? 'bg-purple-500'
							: 'pointer-events bg-purple-100'}"
						style:background={EFFECTOR_BORDER}>+</label
					>
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<ul
						tabindex="0"
						class="dropdown-content menu rounded-box bg-base-100 p-2 shadow"
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
			{/if}
		</div>
		{#if !hasInteraction}
			<p class="text-error">
				An interactable needs at least one side effect with positive or negative
				value to be interactable!
			</p>
		{/if}
		<div class="flex items-center justify-center px-12">
			<div
				class="flex w-fit flex-wrap items-start justify-start gap-x-9 gap-y-14"
			>
				{#each sideEffects as [effectorID, value], i}
					{@const modifierEmoji = $effectors.get(effectorID)?.emoji}
					<div class="relative flex flex-col items-center">
						{#if value == 'trigger'}
							<select
								title="Sequencer name"
								name="Sequence name"
								class="select-bordered select select-sm absolute -bottom-10"
								on:change={(e) => {
									let index = triggers.findIndex(
										([_id, _]) => _id == effectorID
									);

									if (index >= 0) {
										// @ts-expect-error
										triggers[index] = [effectorID, e.target.value];
									} else {
										// @ts-expect-error
										triggers.push([effectorID, e.target.value]);
									}

									updateStore();
								}}
							>
								<option value="none">none</option>
								{#each [...$sequencers] as [id, sequencer]}
									<option value={id}>{sequencer.name}</option>
								{/each}
							</select>
						{/if}
						{#if effectorID === 'any'}
							<div class="slot-lg scale-75">
								{effectorID}
							</div>
						{:else if modifierEmoji}
							<button
								class="absolute -right-2 -top-2 text-lg"
								on:click={() => removeFromSideEffects(i)}>{CROSS}</button
							>
							<div class="slot-lg scale-75">
								<i class="twa twa-{modifierEmoji}" />
							</div>
						{/if}
						<select
							class="select-bordered select select-sm absolute -bottom-4"
							bind:value
							on:change={() => {
								triggers.filter(([_id, _]) => _id == effectorID);
								updateStore();
							}}
						>
							{#each modifierPoints as point}
								<option value={point}
									>{typeof point === 'number' && point > 0
										? `+${point}`
										: point}</option
								>
							{/each}
						</select>
					</div>
				{/each}
				{#each pseudoSideEffects as [emoji, value]}
					<div class="relative flex flex-col items-center">
						<button class="absolute -right-2 -top-2 text-lg">{CROSS}</button>
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
	<div class="flex w-full flex-col items-center justify-center p-4">
		<div class="divider w-full">DROPS</div>
		<div class="relative flex flex-col items-center justify-center">
			<div class="dropdown-right dropdown cursor-pointer">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label tabindex="0" class="slot-lg m-1"
					><i
						class="twa twa-{$effectors.get(drops[0])?.emoji || drops[0]}"
					/></label
				>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
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
</main>

<style>
	.enabled {
		opacity: 1;
	}
</style>
