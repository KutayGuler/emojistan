<script lang="ts">
	import {
		Interactable as TInteractable,
		EditableMap,
		Evolve,
		Devolve,
		Effector,
		Controllable,
		type Branch,
	} from '$src/types';
	import {
		INTERACTABLE_BG,
		INTERACTABLE_BORDER,
		INTERACTABLE_H,
		INTERACTABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import type { TutorialProps } from '../types';
	import type { StringedNumber } from '$src/store';
	import Interactable from '$rbx/Interactable.svelte';

	const tutorialProps: Array<TutorialProps<Interactable>> = [
		{
			header: 'Interactable',
			description:
				'Interactables are very similar to Controllables except they cannot be controlled and have two distinct qualities. They can be talked to and they can drop Effectors once they are destroyed.',
			component: Interactable,
			rbx: {
				id: '3',
				type: 'interactable',
				position: { x: 0, y: 0 },
				width: INTERACTABLE_W,
				height: INTERACTABLE_H,
				bgColor: INTERACTABLE_BG,
				borderColor: INTERACTABLE_BORDER,
			},
			props: {
				id: '3',
				emoji: 'service-dog',
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['0_5', 'woman-walking'],
						['0_6', 'service-dog'],
					])
				),
				controllables: new Map<StringedNumber, Controllable>([
					[
						'0',
						new Controllable(
							'woman-walking',
							1,
							[['any', 0]],
							new Evolve('', 0),
							new Devolve('')
						),
					],
				]),
				interactables: new Map<StringedNumber, TInteractable>([
					[
						'3',
						new TInteractable(
							'service-dog',
							[],
							1,
							[['any', 'talk']],
							new Evolve('', 0),
							new Devolve(''),
							['-9', 0]
						),
					],
				]),
				dt: new Map<string, Branch>([
					['1', ['bark!']],
					['3', ['woof.']],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		{
			header: 'Interactable',
			description:
				'Interactables are very similar to Controllables except they cannot be controlled and have two distinct qualities. They can be talked to and they can drop Effectors once they are destroyed.',
			component: Interactable,
			rbx: {
				id: '5',
				type: 'interactable',
				position: { x: 0, y: 0 },
				width: INTERACTABLE_W,
				height: INTERACTABLE_H,
				bgColor: INTERACTABLE_BG,
				borderColor: INTERACTABLE_BORDER,
			},
			props: {
				id: '5',
				emoji: 'evergreen-tree',
				hp: 3,
				sideEffects: [['any', 0]],
				pseudoSideEffects: [['axe', -1]],
				// @ts-expect-error
				drops: ['wood', 2],
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['0_5', 'woman-walking'],
						['0_6', 'axe'],
						['0_11', 'evergreen-tree'],
						['0_14', 'evergreen-tree'],
						['0_15', 'evergreen-tree'],
					])
				),
				controllables: new Map<StringedNumber, Controllable>([
					[
						'1',
						new Controllable(
							'woman-walking',
							1,
							[],
							new Evolve('', 0),
							new Devolve('')
						),
					],
				]),
				interactables: new Map<StringedNumber, TInteractable>([
					[
						'5',
						new TInteractable(
							'evergreen-tree',
							[],
							3,
							[
								['any', 0],
								['2', -1],
							],
							new Evolve('', 0),
							new Devolve(''),
							['6', 2]
						),
					],
				]),
				effectors: new Map<StringedNumber, Effector>([
					['2', { emoji: 'axe', hp: 9 }],
					['6', { emoji: 'wood', hp: 1 }],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
	];

	let index = 0;
	let props = tutorialProps[index];
	$: props = tutorialProps[index];
</script>

<Tutorial {...props} --header={INTERACTABLE_BORDER} />

<div class="absolute bottom-4 right-4 flex items-center justify-center gap-2">
	<p class="absolute -top-8 w-full">
		{index + 1} / {tutorialProps.length}
	</p>
	{#if index > 0}
		<button class="btn-lg btn" on:click={() => index--}>⮜</button>
	{/if}
	{#if index < tutorialProps.length - 1}
		<button class="btn-lg btn" on:click={() => index++}>⮞</button>
	{:else if index === tutorialProps.length - 1}
		<a href="#tutorial-complete" class="btn-lg btn">FINISH</a>
	{/if}
</div>
