<script lang="ts">
	import {
		type Effector as TEffector,
		EditableMap,
		Controllable,
		Devolve,
		Evolve,
		Interactable,
		type MapLocation,
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

	const tutorialProps: Array<TutorialProps<Effector>> = [
		{
			header: 'Effector',
			description:
				'Effector takes an emoji and a number input. Emoji is the effector itself and the number below it is the number of times it can be used before it disappears. It can be a number between 1 and 100 or "Infinite".',
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
				id: '0',
				emoji: 'test-tube',
			},
			gameProps: {
				map: new EditableMap(
					new Map<MapLocation, string>([
						['0_5', 'woman-walking'],
						['0_6', 'test-tube'],
					])
				),
				controllables: new Map<StringedNumber, Controllable>([
					[
						'1',
						new Controllable(
							'woman-walking',
							1,
							[['0', -1]],
							new Evolve('', 0),
							new Devolve('skull')
						),
					],
				]),
				effectors: new Map<StringedNumber, TEffector>([
					['0', { emoji: 'test-tube', hp: 1, type: 'equippable' }],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		{
			description:
				'Just like in real life, the effect of the Effector depends on who used it.',
			component: Effector,
			rbx: {
				id: '2',
				type: 'effector',
				position: { x: 0, y: 0 },
				width: EFFECTOR_W,
				height: EFFECTOR_H,
				bgColor: EFFECTOR_BG,
				borderColor: EFFECTOR_BORDER,
			},
			props: {
				id: '2',
				emoji: 'test-tube',
			},
			gameProps: {
				map: new EditableMap(
					new Map<MapLocation, string>([
						['0_5', 'monkey'],
						['0_6', 'test-tube'],
					])
				),
				controllables: new Map<StringedNumber, Controllable>([
					[
						'1',
						new Controllable(
							'monkey',
							1,
							[['2', 1]],
							new Evolve('pig', 2),
							new Devolve('')
						),
					],
					[
						'3',
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
					['2', { emoji: 'test-tube', hp: 1, type: 'equippable' }],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		{
			description:
				'Effectors can also be used on the entities other than the player.',
			component: Effector,
			rbx: {
				id: '2',
				type: 'effector',
				position: { x: 0, y: 0 },
				width: EFFECTOR_W,
				height: EFFECTOR_H,
				bgColor: EFFECTOR_BG,
				borderColor: EFFECTOR_BORDER,
			},
			props: {
				id: '2',
				emoji: 'axe',
			},
			gameProps: {
				map: new EditableMap(
					new Map<MapLocation, string>([
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
				interactables: new Map<StringedNumber, Interactable>([
					[
						'-1',
						new Interactable(
							'evergreen-tree',
							'-1',
							3,
							[['2', -1]],
							new Map(),
							new Evolve('', 0),
							new Devolve(''),
							['3', 2]
						),
					],
				]),
				effectors: new Map<StringedNumber, TEffector>([
					['2', { emoji: 'axe', hp: 9, type: 'equippable' }],
					['3', { emoji: 'wood', hp: 1, type: 'equippable' }],
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

<svelte:head>
	<title>Emojistan | Tutorial - Effector</title>
</svelte:head>

<Tutorial {...props} --header={EFFECTOR_BORDER} />

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
		<a href="/tutorial/controllable" class="btn-lg btn">CONTROLLABLE ⮞</a>
	{/if}
</div>
