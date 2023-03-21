<script lang="ts">
	import {
		Equippable as TEquippable,
		EditableMap,
		Interactable,
		Devolve,
		Evolve,
		SequenceItem,
	} from '$src/types';
	import {
		EQUIPPABLE_BG,
		EQUIPPABLE_BORDER,
		EQUIPPABLE_H,
		EQUIPPABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Equippable from '$rbx/Equippable.svelte';

	const tutorialProps = {
		header: 'Equippable',
		description:
			'Just like Consumables, Equippables also take an emoji and a number input. Emoji is the equippable itself and the number is the amount of times it can be used before it disappears.',
		component: Equippable,
		rbx: {
			id: 0,
			type: 'equippable',
			position: { x: 0, y: 0 },
			width: EQUIPPABLE_W,
			height: EQUIPPABLE_H,
			bgColor: EQUIPPABLE_BG,
			borderColor: EQUIPPABLE_BORDER,
		},
		props: {
			id: -69,
			emoji: '🗝️',
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_0', 'monkey'],
					['0_2', 'door'],
					['0_6', 'brick'],
					['0_10', 'brick'],
					['0_12', 'key'],
					['0_14', 'brick'],
					['0_15', 'banana'],
				]),
				-2
			),
			statics: new Set<string>(['brick', 'door', 'banana']),
			equippables: new Map<number, TEquippable>([
				[-69, new TEquippable('key', 1)],
			]),
			interactables: new Map<number, Interactable>([
				[
					-1,
					new Interactable(
						'door',
						[],
						1,
						1,
						[
							['any', 0],
							[-69, -1],
						],
						true,
						new Evolve(false, '', 2),
						new Devolve(false, '')
					),
				],
				[
					-2,
					new Interactable(
						'banana',
						// @ts-expect-error
						[new SequenceItem('completeLevel')],
						1,
						1,
						[['any', -1]],
						true,
						new Evolve(false, '', 2),
						new Devolve(false, '')
					),
				],
			]),

			mapClass: 'simulation',
			SIZE: 4,
		},
	};
</script>

<Tutorial {...tutorialProps} --header={EQUIPPABLE_BORDER} />

<p class="self-start p-4">Equippables can only be used on Interactables.</p>
