<script lang="ts">
	import {
		Controllable as TControllable,
		EditableMap,
		Interactable,
		Devolve,
		Evolve,
		Effector,
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

	const tutorialProps: TutorialProps = {
		header: 'Controllable',
		description:
			'Just like Effectors, Controllables also take an emoji and a number input. Emoji is the equippable itself and the number is the amount of times it can be used before it disappears.',
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
					['0_0', 'baby'],
					['0_3', 'brick'],
					['0_6', 'brick'],
					['0_9', 'brick'],
					['0_12', 'brick'],
				])
			),
			controllables: new Map<StringedNumber, TControllable>([
				[
					'1',
					new TControllable(
						'baby',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			effectors: new Map<StringedNumber, Effector>([
				['0', { emoji: 'key', hp: 1 }],
				['2', { emoji: 'banana', hp: 1 }],
			]),
			mapClass: 'simulation',
			SIZE: 4,
		},
	};
</script>

<Tutorial {...tutorialProps} --header={CONTROLLABLE_BORDER} />

<p class="self-start p-4">Controllables can only be used on Interactables.</p>
