<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { mergers, pushers, formattedEmoji, } from '../store';
	import { notifications } from '../routes/notifications';
	import { rbxStore } from '$src/lib/stores/store';
	import type { Merger,  StringedNumber } from '$src/types';

	export let id: StringedNumber;
	export let slots: Merger = ['', '', ''];

	onMount(() => {
		slots = $mergers.get(id) || slots;
	});

	function checkCollision() {
		for (let [_id, _slots] of $pushers.entries()) {
			if (_slots[0] === slots[0] && _slots[1] === slots[1]) {
				slots = ['', '', ''];
				notifications.warning('Cannot have conflicting behaviours.');
				break;
			}
		}

		for (let [_id, _slots] of $mergers.entries()) {
			if (id === _id) continue;
			let _firstTwo = [_slots[0], _slots[1]];
			let firstTwo = [slots[0], slots[1]];
			if (
				_firstTwo.toString() === firstTwo.toString() ||
				_firstTwo.reverse().toString() === firstTwo.toString()
			) {
				slots = ['', '', ''];
				notifications.warning(
					'mergers are bidirectional and can only have one outcome'
				);
				break;
			}
		}

		mergers.update(id, slots);
	}

	function updateSlot(i: number) {
		slots[i] = $formattedEmoji;
		if (slots.includes('')) return;
		if (slots[0] === slots[2] || slots[1] === slots[2]) {
			slots = ['', '', ''];
			notifications.warning('Inputs cannot be the same with output');
			return;
		}

		checkCollision();
	}

	onDestroy(() => {
		if (slots.includes('')) {
			mergers.remove(id);
			rbxStore.remove(id);
		}
	});
</script>

<div class="flex h-full flex-row items-center justify-center gap-2">
	<button class="slot" on:click={() => updateSlot(0)}>
		<i class="twa twa-{slots[0]}" />
	</button>
	<div class="text-2xl">+</div>
	<button class="slot" on:click={() => updateSlot(1)}>
		<i class="twa twa-{slots[1]}" />
	</button>
	<div class="text-2xl">=</div>
	<button class="slot" on:click={() => updateSlot(2)}>
		<i class="twa twa-{slots[2]}" />
	</button>
</div>
