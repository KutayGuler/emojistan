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
		// EVOLUTION (monkey with banana, eats 4 bananas, evolves to human)
		// {
		// 	header: 'Interactable',
		// 	description:
		// 		'Evolve [ <i class="twa twa-dna"></i> ], as the name suggests, makes the Interactable evolvable. When Interactable\'s HP reaches to evolve limit, the emoji transforms and HP resets to evolved version\'s [ <i class="twa twa-man-walking"></i> ] HP. Which in this case is 1.',
		// 	veilHeight: 476,
		// 	component: Interactable,
		// 	rbx: {
		// 		id: '0',
		// 		type: 'controllable',
		// 		position: { x: 0, y: 0 },
		// 		width: INTERACTABLE_W,
		// 		height: INTERACTABLE_H,
		// 		bgColor: INTERACTABLE_BG,
		// 		borderColor: INTERACTABLE_BORDER,
		// 	},
		// 	props: {
		// 		id: '1',
		// 		emoji: 'baby',
		// 		evolve: new Evolve('man-walking', 5),
		// 		devolve: new Devolve(''),
		// 		hp: 1,
		// 	},
		// 	gameProps: {
		// 		map: new EditableMap(
		// 			new Map<string, string>([
		// 				['0_5', 'woman-walking'],
		// 				['0_6', 'dog'],
		// 				['0_11', 'bone'],
		// 			])
		// 		),
		// 		controllables: new Map<StringedNumber, Controllable>([
		// 			[
		// 				'0',
		// 				new Controllable(
		// 					'woman-walking',
		// 					1,
		// 					[['any', 0]],
		// 					new Evolve('', 0),
		// 					new Devolve('')
		// 				),
		// 			],
		// 		]),
		// 		interactables: new Map<StringedNumber, TInteractable>([
		// 			[
		// 				'1',
		// 				new TInteractable(
		// 					'dog',
		// 					[],
		// 					1,
		// 					[
		// 						['any', 'talk'],
		// 						['2', 1],
		// 					],
		// 					new Evolve('service-dog', 2),
		// 					new Devolve(''),
		// 					['-9', 0]
		// 				),
		// 			],
		// 			[
		// 				'3',
		// 				new TInteractable(
		// 					'service-dog',
		// 					[],
		// 					1,
		// 					[['any', 'talk']],
		// 					new Evolve('', 0),
		// 					new Devolve(''),
		// 					['-9', 0]
		// 				),
		// 			],
		// 		]),
		// 		effectors: new Map<StringedNumber, Effector>([
		// 			['2', new Effector('bone', 1)],
		// 		]),
		// 		dt: new Map<string, Branch>([
		// 			['1', ['bark!']],
		// 			['3', ['woof.']],
		// 		]),
		// 		mapClass: 'simulation',
		// 		SIZE: 4,
		// 	},
		// },
		// DEVOLUTION (human eats 4 test-tube's devolves to rat)
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
		// SIDE EFFECTS
		// {
		// 	header: 'Interactable',
		// 	description:
		// 		'Side effects are basically Equippables that affect the health of the Interactable. Side Effects need two questions: "What" and "How much?" In this example, the answers are "any" and "0" consecutively. Meaning, nothing can destroy that door, even that giant key.',
		// 	props: {
		// 		id: 'sideEffects',
		// 		emoji: 'door',
		// 		isControllable: false,
		// 		evolve: new Evolve('', 2),
		// 		devolve: new Devolve(''),
		// 		hp: 1,
		// 	},
		// 	gameProps: {
		// 		map: new EditableMap(
		// 			new Map<string, string>([
		// 				['0_0', 'monkey'],
		// 				['0_2', 'door'],
		// 				['0_6', 'brick'],
		// 				['0_10', 'brick'],
		// 				['0_12', 'key'],
		// 				['0_14', 'brick'],
		// 				['0_15', 'banana'],
		// 			])
		// 		),
		// 		effectors: new Map<StringedNumber, Effector>([
		// 			['69', new Effector('key', 1)],
		// 		]),
		// 		// @ts-expect-error
		// 		interactables: new Map<number, TInteractable>([
		// 			[
		// 				'sideEffects',
		// 				new TInteractable(
		// 					'door',
		// 					[],
		// 					1,
		// 					[['any', 0]],
		// 					new Evolve('', 2),
		// 					new Devolve(''),
		// 					['', 0]
		// 				),
		// 			],
		// 		]),
		// 		mapClass: 'simulation',
		// 		SIZE: 4,
		// 	},
		// },
		//SIDE EFFECTS CAN OPEN DOOR (door and monkey, interacting with "any" will be of no use, will have to use a key)
		// {
		// 	header: 'Interactable',
		// 	description:
		// 		"Look! A new side effect has been added. It says [ key ] and [ -1 ]. Let's see if we can open that door now 🧐.",
		// 	props: {
		// 		id: 'sideEffects',
		// 		emoji: 'door',
		// 		evolve: new Evolve('', 2),
		// 		devolve: new Devolve(''),
		// 		hp: 1,
		// 		pseudoSideEffects: [['key', -1]],
		// 	},
		// 	gameProps: {
		// 		map: new EditableMap(
		// 			new Map<string, string>([
		// 				['0_0', 'monkey'],
		// 				['0_2', 'door'],
		// 				['0_6', 'brick'],
		// 				['0_10', 'brick'],
		// 				['0_12', 'key'],
		// 				['0_14', 'brick'],
		// 				['0_15', 'banana'],
		// 			])
		// 		),
		// 		effectors: new Map<StringedNumber, Effector>([
		// 			['69', new Effector('key', 1)],
		// 		]),
		// 		// @ts-expect-error
		// 		interactables: new Map<number, TInteractable>([
		// 			[
		// 				'sideEffects',
		// 				new TInteractable(
		// 					'door',
		// 					[],
		// 					1,
		// 					[
		// 						['any', 0],
		// 						['69', -1],
		// 					],
		// 					new Evolve('', 2),
		// 					new Devolve(''),
		// 					['', 0]
		// 				),
		// 			],
		// 		]),
		// 		mapClass: 'simulation',
		// 		SIZE: 4,
		// 	},
		// },
		// EVENT SEQUENCE (the level from equippable)
		// {
		// 	header: 'Interactable',
		// 	description:
		// 		"In the previous levels, interacting with the banana would end the game, why it doesn't right now? Let's fix that by adding a function to the Event Sequence!",
		// 	veilHeight: 0,
		// 	props: {
		// 		id: 'sequence',
		// 		sequence: [{ type: 'completeLevel' }],
		// 		emoji: 'banana',
		// 		isControllable: false,
		// 		sideEffects: [['any', -1]],
		// 		evolve: new Evolve(false, '', 2),
		// 		devolve: new Devolve(false, ''),
		// 		hp: 1,
		// 	},
		// 	gameProps: {
		// 		map: new EditableMap(
		// 			new Map<string, string>([
		// 				['0_0', 'monkey'],
		// 				['0_2', 'door'],
		// 				['0_6', 'brick'],
		// 				['0_10', 'brick'],
		// 				['0_12', 'key'],
		// 				['0_14', 'brick'],
		// 				['0_15', 'banana'],
		// 			])
		// 		),
		// 		equippables: new Map<number, Equippable>([
		// 			[69, new Equippable('key', 1)],
		// 		]),
		// 		// @ts-expect-error
		// 		interactables: new Map<number, TInteractable>([
		// 			[
		// 				'sequence',
		// 				new TInteractable(
		// 					'banana',
		// 					// @ts-expect-error
		// 					[{ type: 'completeLevel' }],
		// 					1,
		// 					1,
		// 					[['any', -1]],
		// 					true,
		// 					new Evolve(false, '', 2),
		// 					new Devolve(false, '')
		// 				),
		// 			],
		// 			[
		// 				'sideEffects',
		// 				new TInteractable(
		// 					'door',
		// 					[],
		// 					1,
		// 					1,
		// 					[
		// 						['any', 0],
		// 						[69, -1],
		// 					],
		// 					true,
		// 					new Evolve(false, '', 2),
		// 					new Devolve(false, '')
		// 				),
		// 			],
		// 		]),
		// 		mapClass: 'simulation',
		// 		SIZE: 4,
		// 	},
		// },
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
