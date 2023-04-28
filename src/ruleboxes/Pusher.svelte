<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { pushers, formattedEmoji, type StringedNumber } from '../store';
	import { notifications } from '../routes/notifications';
	import { rbxStore } from '$src/lib/stores/store';
	import type { Pusher } from '$src/types';

	export let id: StringedNumber;
	export let slots: Pusher = ['', '', 'push'];

	onMount(() => {
		slots = $pushers.get(id) || slots;
	});

	function checkCollision() {
		for (let [_id, _slots] of $pushers.entries()) {
			if (id === _id) continue;
			if (_slots[0] === slots[0] && _slots[1] === slots[1]) {
				slots = ['', '', 'push'];
				notifications.warning("Can't have duplicate pushers.");
				break;
			}
		}

		pushers.update(id, slots);
	}

	function updateSlot(i: number) {
		slots[i] = $formattedEmoji;
		if (!slots.includes('')) {
			checkCollision();
		}
	}

	onDestroy(() => {
		if (slots.includes('')) {
			pushers.remove(id);
			rbxStore.remove(id);
		}
	});
</script>

<div class="flex h-full flex-row items-center justify-center gap-2">
	<button class="slot" on:click={() => updateSlot(0)}>
		<i class="twa twa-{slots[0]}" />
	</button>
	<i class="twa twa-dashing-away text-2xl" />
	<!-- <div>💨</div> -->
	<button class="slot" on:click={() => updateSlot(1)}>
		<i class="twa twa-{slots[1]}" />
	</button>
</div>
