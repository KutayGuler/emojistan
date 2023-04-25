<script lang="ts">
	import {
		DEFAULT_SIDE_LENGTH,
		CROSS,
		MAX_SIDE_EFFECT,
		EFFECTOR_BORDER,
	} from '$src/constants';
	import { Devolve, Evolve, Controllable } from '$src/types';
	import { onDestroy, onMount } from 'svelte';
	import { notifications } from '../routes/notifications';
	import {
		formattedEmoji,
		controllables,
		effectors,
		type StringedNumber,
	} from '../store';
	import { hasDuplicate, hasDuplicateIn } from './utils';

	let indexes: Array<number> = [];
	let hps: Array<number> = [];
	let modifierPoints: Array<number> = [];

	for (let i = 0; i < 100; i++) {
		hps[i] = i + 1;
		modifierPoints[i] = i + 1;
	}

	for (let i = 0; i >= -100; i--) {
		modifierPoints.unshift(i);
	}

	for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
		indexes[i] = i;
	}

	// COMPONENT RELATED
	export let id: StringedNumber;
	export let emoji = '';
	export let hp = 1;
	export let sideEffects: Array<['any' | StringedNumber, number]> = [];
	export let pseudoSideEffects: Array<['any' | StringedNumber, number]> = [];
	export let evolve = new Evolve('', 2);
	export let devolve = new Devolve('');

	onMount(() => {
		console.log(id, $controllables);

		let obj = $controllables.get(id);
		if (obj) {
			({ emoji, hp, sideEffects, evolve, devolve } = obj);
		}
	});

	function updateStore() {
		controllables.update(
			id,
			new Controllable(emoji, hp, sideEffects, evolve, devolve)
		);
	}

	onDestroy(() => {
		// if (emoji === '') {
		// 	controllables.remove(id);
		// 	rbxStore.remove(id);
		// 	return;
		// }

		sideEffects = sideEffects.filter((sideEffect) => {
			if (sideEffect[0] === 'any') return true;
			return $effectors.get(sideEffect[0])?.emoji != '';
		});
		sideEffects = sideEffects.filter((m, i) => {
			if (i === 0) return true;
			return m[1] != 0;
		});
		updateStore();
	});

	function addTosideEffects(equippableID: 'any' | StringedNumber) {
		if (sideEffects.some(([id, val]) => id === equippableID)) return;
		if (sideEffects.length === MAX_SIDE_EFFECT) {
			notifications.warning(
				`Cannot have more than ${MAX_SIDE_EFFECT} side effects`
			);
			return;
		}
		sideEffects = [...sideEffects, [equippableID, 0]];
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
				'A Controllable cannot evolve or devolve to itself'
			);
			return;
		}

		if (
			hasDuplicateIn<Controllable>(id, controllables, 'controllable') ||
			hasDuplicate()
		) {
			return;
		}

		emoji = $formattedEmoji;
		updateStore();
	}

	function updateEvolveEmoji() {
		if (emoji === $formattedEmoji) {
			notifications.warning('A Controllable cannot evolve to itself');
			return;
		}

		evolve.to = $formattedEmoji;
		updateStore();
	}

	// this function deals with two-way binded variable
	function updateHP() {
		if (evolve.to && hp >= evolve.at) {
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

	function checkEvolve(e: any) {
		if (evolve.at < hp) {
			evolve.at = hp + 1;
		}
	}

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
		<button title="Controllable Emoji" class="slot-lg" on:click={updateEmoji}>
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
						<div class="rounded-md p-1">No equippables defined.</div>
					{/each}
				</ul>
			</div>
		</div>
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
										>{point > 0 ? `+${point}` : point}</option
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
										>{point > 0 ? `+${point}` : point}</option
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
</main>

<style>
	span {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.enabled {
		opacity: 1;
	}
</style>
