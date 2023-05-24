<script lang="ts">
	import {
		onMouseMove,
		onRuleboxClick,
		rbxStore,
		rbxSelected,
		rbxIdSelected,
		movementStore,
	} from '$lib/stores/store';
	import {
		effectors,
		controllables,
		dialogueTree,
		interactables,
		mergers,
		modal,
		pushers,
		sequencers,
	} from '$src/store';

	import type { Rulebox } from '$lib/types/types';
	import ContextMenu from '$rbx/ContextMenu.svelte';
	import Interactable from '$rbx/Interactable.svelte';
	import Pusher from '$rbx/Pusher.svelte';
	import Merger from '$rbx/Merger.svelte';
	import Effector from '$rbx/Effector.svelte';
	import Controllable from '$rbx/Controllable.svelte';
	import { CROSS } from '$src/constants';
	import Sequencer from '$rbx/Sequencer.svelte';

	export let rbx: Rulebox;
	export let props: any = {};

	$: shouldMove = moving && $movementStore;

	// $rbxSelected is a store boolean that lets GraphView component know if ANY rulebox is selected
	// moving local boolean specific to rulebox selected, to change position of individual rulebox once selected
	let moving = false;
	let moved = false;

	function remove() {
		if (rbx.type === 'interactable' && $dialogueTree.has(rbx.id.toString())) {
			modal.show({
				content:
					'All dialogue content connected to this Interactable will be lost.',
				header: 'Are you sure?',
				confirmText: 'DELETE',
				onConfirm: () => {
					dialogueTree.remove(rbx.id.toString());
					rbxStore.remove(rbx.id);
					interactables.remove(rbx.id);
				},
				input: false,
				danger: true,
			});
			return;
		} else if (rbx.type === 'effector') {
			for (let [id, val] of [...$controllables, ...$interactables]) {
				for (let [effectorID, _] of val.sideEffects) {
					if (rbx.id == effectorID) {
						modal.show({
							content: `Remove the Effector from <i class="twa twa-${val.emoji}"></i>'s side effects before deleting it.`,
							header: 'Existing Relations',
							confirmText: 'OKAY',
							onConfirm: () => {},
							input: false,
							danger: false,
						});
						return;
					}
				}
			}
		} else if (rbx.type === 'sequencer') {
			for (let [_, val] of $interactables) {
				for (let [id, effectType] of val.sideEffects) {
					if (effectType === 'trigger' && val.triggers.has(id)) {
						modal.show({
							content: `Remove the trigger from <i class="twa twa-${val.emoji}"></i>'s side effects before deleting it.`,
							header: 'Existing Relations',
							confirmText: 'OKAY',
							onConfirm: () => {},
							input: false,
							danger: false,
						});
						return;
					}
				}
			}
		}

		rbxStore.remove(rbx.id);

		// CF #11
		switch (rbx.type) {
			case 'pusher':
				pushers.remove(rbx.id);
				break;
			case 'merger':
				mergers.remove(rbx.id);
				break;
			case 'effector':
				effectors.remove(rbx.id);
				break;
			case 'controllable':
				controllables.remove(rbx.id);
				break;
			case 'sequencer':
				sequencers.remove(rbx.id);
				break;
			case 'interactable':
				interactables.remove(rbx.id);
				break;
			default:
				break;
		}
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code === 'KeyR') {
			$rbxSelected = false;
			moving = false;
			moved = false;
		}
	}}
	on:mousemove={(e) => {
		e.preventDefault();
		if (shouldMove) {
			onMouseMove(e, rbx.id);
			moved = true;
		}
	}}
/>

<div
	class="rulebox cursor-auto border-2 border-black shadow-xl"
	style="left: {rbx.position.x}px;
    top: {rbx.position.y}px;
    width: {rbx.width}px;
    height: {rbx.height}px;
    background-color: {rbx.bgColor};"
	id="svelvet-{rbx.id}"
>
	<nav
		class="min-h-6 w-full cursor-move"
		style:display={rbx.type === 'ctxMenu' ? 'none' : 'block'}
		style:background-color={rbx.borderColor}
		on:mousedown={(e) => {
			e.preventDefault();
			moving = true;
			$rbxIdSelected = rbx.id;
			$rbxSelected = true;
		}}
		on:mouseup={(e) => {
			moving = false;
			$rbxSelected = false;
			if (!moved && rbx.id === $rbxIdSelected) {
				onRuleboxClick(e, rbx.id);
			}
			moved = false;
		}}
	/>
	<!-- CF #3 -->
	<button
		style:display={rbx.type === 'ctxMenu' ? 'none' : 'flex'}
		style="border-color: {rbx.borderColor}"
		class="absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-2 bg-white text-center text-xl"
		on:click={remove}
	>
		{CROSS}
	</button>
	<!-- CF #2 -->
	{#if rbx.type === 'ctxMenu'}
		<ContextMenu position={rbx.position} {...props} />
	{:else if rbx.type === 'interactable'}
		<Interactable id={rbx.id} {...props} />
	{:else if rbx.type === 'controllable'}
		<Controllable id={rbx.id} {...props} />
	{:else if rbx.type === 'effector'}
		<Effector id={rbx.id} {...props} />
	{:else if rbx.type === 'pusher'}
		<Pusher id={rbx.id} {...props} />
	{:else if rbx.type === 'sequencer'}
		<Sequencer id={rbx.id} {...props} />
	{:else if rbx.type === 'merger'}
		<Merger id={rbx.id} {...props} />
	{/if}
</div>

<style>
	.rulebox {
		transition: height 150ms ease-out;
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		user-select: none;
		overscroll-behavior: auto;
		font-size: 14px;
		text-align: center;
		/* box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2); */
	}
</style>
