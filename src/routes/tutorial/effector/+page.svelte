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
			'Effector takes an emoji and a number input. Emoji is the effector itself and the number below it is the HP side effect consumer will be subjected to.',
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
			effectors: new Map<StringedNumber, TEffector>([
				['-1', { emoji: 'banana', sideEffect: 1, mutateConsumerTo: '' }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};

	const secondTutorialProps: TutorialProps = {
		description:
			'On the top left corner, the <i class="twa twa-dna text-2xl"></i> icon enables mutation and disables the HP side effect. If mutation is enabled, another slot opens up to determine what the consumer will mutate into.',
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
				['-2', { emoji: 'test-tube', sideEffect: 1, mutateConsumerTo: 'pig' }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};
</script>

<Tutorial {...firstTutorialProps} --header={EFFECTOR_BORDER} />
<Tutorial {...secondTutorialProps} />
