<script lang="ts">
	import {
		type Effector as TEffector,
		EditableMap,
		Controllable,
		Devolve,
		Evolve,
	} from '$src/types';
	import {
		EFFECTOR_BG,
		EFFECTOR_BORDER,
		EFFECTOR_H,
		EFFECTOR_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Effector from '$rbx/Effector.svelte';
	import type { TutorialProps } from '../types';
	import type { StringedNumber } from '$src/store';

	const firstTutorialProps: TutorialProps = {
		header: 'Effector',
		description:
			'Effector takes an emoji and a number input. Emoji is the effector itself and the number below it is the number of times it can be used before it disappears. It can be a number between 1 and 100 or "Infinite"',
		component: Effector,
		rbx: {
			id: '0',
			type: 'effector',
			position: { x: 0, y: 0 },
			width: EFFECTOR_W,
			height: EFFECTOR_H,
			bgColor: EFFECTOR_BG,
			borderColor: EFFECTOR_BORDER,
		},
		props: {
			id: -1,
			emoji: 'test-tube',
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_5', 'woman-walking'],
					['0_6', 'test-tube'],
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'0',
					new Controllable(
						'woman-walking',
						1,
						[
							['any', 0],
							['-1', -1],
						],
						new Evolve('', 0),
						new Devolve('skull')
					),
				],
			]),
			effectors: new Map<StringedNumber, TEffector>([
				['-1', { emoji: 'test-tube', hp: 1 }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};

	const secondTutorialProps: TutorialProps = {
		description:
			'Just like in real life, the effect of the Effector depends on the entity Effector has been applied on.',
		component: Effector,
		rbx: {
			id: '0',
			type: 'effector',
			position: { x: 0, y: 0 },
			width: EFFECTOR_W,
			height: EFFECTOR_H,
			bgColor: EFFECTOR_BG,
			borderColor: EFFECTOR_BORDER,
		},
		props: {
			id: -2,
			emoji: 'test-tube',
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
				[
					'1',
					new Controllable(
						'pig',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			effectors: new Map<StringedNumber, TEffector>([
				['-2', { emoji: 'test-tube', hp: 1 }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};

	// TODO: make two tutorials, one for consumption, one for using an item on another entity
</script>

<Tutorial {...firstTutorialProps} --header={EFFECTOR_BORDER} />
<Tutorial {...secondTutorialProps} />
