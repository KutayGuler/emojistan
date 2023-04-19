<script lang="ts">
	import {
		Controllable as TControllable,
		EditableMap,
		Interactable,
		Devolve,
		Evolve,
		Consumable,
		Equippable,
	} from '$src/types';
	import {
		CONTROLLABLE_BG,
		CONTROLLABLE_BORDER,
		CONTROLLABLE_H,
		CONTROLLABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Controllable from '$rbx/Controllable.svelte';
	import type { StringedNumber } from '$src/store';
	import type { TutorialProps } from '../types';

	// TODO: baby brick example

	const tutorialProps: TutorialProps = {
		header: 'Controllable',
		description:
			'Just like Consumables, Controllables also take an emoji and a number input. Emoji is the equippable itself and the number is the amount of times it can be used before it disappears.',
		component: Controllable,
		rbx: {
			id: '0',
			type: 'controllable',
			position: { x: 0, y: 0 },
			width: CONTROLLABLE_W,
			height: CONTROLLABLE_H,
			bgColor: CONTROLLABLE_BG,
			borderColor: CONTROLLABLE_BORDER,
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
			controllables: new Map<StringedNumber, TControllable>([
				[
					'1',
					new TControllable(
						'monkey',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			equippables: new Map<StringedNumber, Equippable>([
				['0', new Equippable('key', 1)],
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

<Tutorial {...tutorialProps} --header={CONTROLLABLE_BORDER} />

<p class="self-start p-4">Controllables can only be used on Interactables.</p>
