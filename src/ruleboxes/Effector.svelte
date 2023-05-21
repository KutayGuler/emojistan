<script lang="ts">
	import { notifications } from '$src/routes/notifications';
	import {
		effectors,
		formattedEmoji,
		interactables,
		type StringedNumber,
	} from '$src/store';
	import { Effector } from '$src/types';
	import { onDestroy, onMount } from 'svelte';
	import { hasDuplicateIn, hasDuplicate } from './utils';

	// TODO:

	export let id: StringedNumber;
	export let emoji = '';
	export let hp: number | 'Infinite' = 1;

	let modifierPoints: Array<number | 'Infinite'> = ['Infinite'];

	for (let i = 1; i <= 100; i++) {
		modifierPoints[i] = i;
	}

	onMount(() => {
		let obj = $effectors.get(id);
		if (obj) {
			({ emoji, hp } = obj);
		}
	});

	onDestroy(() => {
		if (emoji === '') {
			effectors.remove(id);
			return;
		}
	});

	function updateStore() {
		effectors.update(id, new Effector(emoji, hp));
	}

	function updateEmoji() {
		if (hasDuplicateIn<Effector>(id, effectors, 'effector') || hasDuplicate()) {
			return;
		}

		emoji = $formattedEmoji;
		updateStore();
	}
</script>

<div class="absolute -top-8 flex flex-row items-center justify-center gap-2">
	<div class="flex flex-col items-center justify-center">
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
</div>
