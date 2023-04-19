<script lang="ts">
	import {
		Equippable as TEquippable,
		EditableMap,
		Interactable,
		Devolve,
		Evolve,
		Controllable,
		Consumable,
	} from '$src/types';
	import {
		EQUIPPABLE_BG,
		EQUIPPABLE_BORDER,
		EQUIPPABLE_H,
		EQUIPPABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Equippable from '$rbx/Equippable.svelte';
	import type { StringedNumber } from '$src/store';
	import type { TutorialProps } from '../types';

	const tutorialProps: TutorialProps = {
		header: 'Equippable',
		description:
			'Just like Consumables, Equippables also take an emoji and a number input. Emoji is the equippable itself and the number is the amount of times it can be used before it disappears.',
		component: Equippable,
		rbx: {
			id: '0',
			type: 'equippable',
			position: { x: 0, y: 0 },
			width: EQUIPPABLE_W,
			height: EQUIPPABLE_H,
			bgColor: EQUIPPABLE_BG,
			borderColor: EQUIPPABLE_BORDER,
		},
		props: {
			id: '0',
			emoji: 'key',
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
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'1',
					new Controllable(
						'monkey',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			equippables: new Map<StringedNumber, TEquippable>([
				['0', new TEquippable('key', 1)],
			]),
			consumables: new Map<StringedNumber, Consumable>([
				['2', { emoji: 'banana', sideEffect: 1, mutateConsumerTo: '' }],
			]),
			interactables: new Map<StringedNumber, Interactable>([
				[
					'3',
					new Interactable(
						'door',
						[],
						1,
						[
							['any', 0],
							['0', -1],
						],
						new Evolve('', 2),
						new Devolve(''),
						['', 0]
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
