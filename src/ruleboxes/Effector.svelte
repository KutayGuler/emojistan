<script lang="ts">
	import { effectors, formattedEmoji, type StringedNumber } from '$src/store';
	import { Effector, type EffectorType } from '$src/types';
	import { onDestroy, onMount } from 'svelte';
	import { hasDuplicateIn, hasDuplicate } from './utils';

	export let id: StringedNumber;
	export let emoji = '';
	export let hp: number | 'Infinite' = 1;
	export let type: EffectorType = 'equippable';

	let modifierPoints: Array<number | 'Infinite'> = ['Infinite'];

	for (let i = 1; i <= 100; i++) {
		modifierPoints[i] = i;
	}

	let mounted = false;

	onMount(() => {
		let obj = $effectors.get(id);
		if (obj) {
			({ emoji, hp, type } = obj);
		}
		mounted = true;
	});

	onDestroy(() => {
		if (emoji === '') {
			effectors.remove(id);
			return;
		}
	});

	function updateStore() {
		effectors.update(id, new Effector(emoji, hp, type));
	}

	function updateEmoji() {
		if (hasDuplicateIn<Effector>(id, effectors, 'effector') || hasDuplicate()) {
			return;
		}

		emoji = $formattedEmoji;
		updateStore();
	}

	$: mounted && type && updateStore();
</script>

<div class="absolute -top-8 flex flex-col items-center justify-center gap-2">
	<div class="relative flex flex-col items-center justify-center">
		<button class="slot-lg" on:click={updateEmoji}>
			<i class="twa twa-{emoji}" />
		</button>
		<div class="absolute -bottom-4">
			<select
				class="select-bordered select select-sm text-xl"
				title="sideEffect"
				bind:value={hp}
				on:change={updateStore}
			>
				{#each modifierPoints as point}
					<option value={point}>{point}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="flex flex-col items-start pt-8">
		<label class="label cursor-pointer" title="Collideable">
			<input
				class="radio checked:bg-purple-500"
				name="type"
				value="collideable"
				type="radio"
				bind:group={type}
			/>
			<span class="label-text pl-4 text-lg">
				<i class="twa twa-collision" />
			</span>
		</label>
		<label class="label cursor-pointer" title="Equippable">
			<input
				class="radio checked:bg-purple-500"
				name="type"
				value="equippable"
				type="radio"
				bind:group={type}
			/>
			<span class="label-text pl-4 text-lg">
				<i class="twa twa-gloves" />
			</span>
		</label>
		<label class="label cursor-pointer" title="Collideable & Equippable">
			<input
				class="radio checked:bg-purple-500"
				name="type"
				value="both"
				type="radio"
				bind:group={type}
			/>
			<span class="label-text pl-4 text-lg">
				<i class="twa twa-collision" />
				&
				<i class="twa twa-gloves" />
			</span>
		</label>
	</div>
</div>
