<script lang="ts">
	import {
		Controllable as TControllable,
		EditableMap,
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

	const tutorialProps: Array<TutorialProps<Controllable>> = [
		{
			veilHeight: 520,
			veilColor: 'bg-green-50',
			header: 'Controllable',
			description:
				'Controllables, as the nume suggests, are the emojis that can be controlled by the player. At least one Controllable is required in the map for your game to be playable.',
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
				emoji: 'baby',
			},
			gameProps: {
				map: new EditableMap(new Map<string, string>([['0_0', 'baby']])),
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
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		{
			header: 'Controllable',
			description:
				'Controllables, as the nume suggests, are the emojis that can be controlled by the player. At least one Controllable is required in the map for your game to be playable.',
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
				emoji: 'baby',
				evolve: new Evolve('woman-walking', 5),
				pseudoSideEffects: [['3', 1]],
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['0_0', 'baby'],
						['0_10', 'baby-bottle'],
						['0_11', 'baby-bottle'],
						['0_14', 'baby-bottle'],
						['0_15', 'baby-bottle'],
					])
				),
				controllables: new Map<StringedNumber, TControllable>([
					[
						'0',
						new TControllable(
							'baby',
							1,
							[['3', 1]],
							new Evolve('woman-walking', 5),
							new Devolve('')
						),
					],
					[
						'2',
						new TControllable(
							'woman-walking',
							1,
							[],
							new Evolve('', 0),
							new Devolve('')
						),
					],
				]),
				effectors: new Map<StringedNumber, Effector>([
					['3', { emoji: 'baby-bottle', hp: 1 }],
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

<Tutorial {...props} --header={CONTROLLABLE_BORDER} />

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
		<a href="/tutorial/controllable" class="btn-lg btn">INTERACTABLE ⮞</a>
	{/if}
</div>
