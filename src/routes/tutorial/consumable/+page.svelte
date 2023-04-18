<script lang="ts">
	import {
		type Consumable as TConsumable,
		EditableMap,
		Controllable,
		Devolve,
		Evolve,
	} from '$src/types';
	import {
		CONSUMABLE_BG,
		CONSUMABLE_BORDER,
		CONSUMABLE_H,
		CONSUMABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Consumable from '$rbx/Consumable.svelte';
	import type { TutorialProps } from '../types';
	import type { StringedNumber } from '$src/store';

	// FIXME: Pig not moving after mutation

	const firstTutorialProps: TutorialProps = {
		header: 'Consumable',
		description:
			'Consumable takes an emoji and a number input. Emoji is the consumable itself and the number below it is the HP side effect consumer will be subjected to.',
		component: Consumable,
		rbx: {
			id: '0',
			type: 'consumable',
			position: { x: 0, y: 0 },
			width: CONSUMABLE_W,
			height: CONSUMABLE_H,
			bgColor: CONSUMABLE_BG,
			borderColor: CONSUMABLE_BORDER,
		},
		props: {
			id: -1,
			emoji: 'banana',
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_5', 'monkey'],
					['0_6', 'banana'],
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'0',
					new Controllable(
						'monkey',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			consumables: new Map<StringedNumber, TConsumable>([
				['-1', { emoji: 'banana', sideEffect: 1, mutateConsumerTo: '' }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};

	const secondTutorialProps: TutorialProps = {
		description:
			'On the top left corner, the 🧬 icon enables mutation and disables the HP side effect. If mutation is enabled, another slot opens up to determine what the consumer will mutate into.',
		component: Consumable,
		rbx: {
			id: '0',
			type: 'consumable',
			position: { x: 0, y: 0 },
			width: CONSUMABLE_W,
			height: CONSUMABLE_H,
			bgColor: CONSUMABLE_BG,
			borderColor: CONSUMABLE_BORDER,
		},
		props: {
			id: -2,
			emoji: '🧪',
			mutateConsumer: true,
			mutateConsumerTo: 'pig',
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_5', 'monkey'],
					['0_6', 'test-tube'],
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'0',
					new Controllable(
						'monkey',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			consumables: new Map<StringedNumber, TConsumable>([
				['-2', { emoji: 'test-tube', sideEffect: 1, mutateConsumerTo: 'pig' }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};
</script>

<Tutorial {...firstTutorialProps} --header={CONSUMABLE_BORDER} />
<Tutorial {...secondTutorialProps} />
