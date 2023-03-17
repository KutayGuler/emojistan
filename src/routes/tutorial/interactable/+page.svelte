<script lang="ts">
	import {
		Interactable as TInteractable,
		Equippable,
		EditableMap,
		Evolve,
		Devolve,
		Consumable,
	} from '$src/types';
	import {
		INTERACTABLE_BG,
		INTERACTABLE_BORDER,
		INTERACTABLE_H,
		INTERACTABLE_W,
	} from '$src/constants';
	import Tutorial from '../Tutorial.svelte';

	let index = 0;

	const rbx = {
		id: 0,
		type: 'interactable',
		position: { x: 0, y: 0 },
		width: INTERACTABLE_W,
		height: INTERACTABLE_H,
		bgColor: INTERACTABLE_BG,
		borderColor: INTERACTABLE_BORDER,
	};

	const tutorialProps = [
		{
			header: 'Interactable',
			description:
				'Interactables are the most complex ruleboxes. We will explain each feature with examples.',
			gameProps: {
				map: new EditableMap(new Map<string, string>()),
				mapClass: 'simulation',
				SIZE: 4,
			},
			veilHeight: 0,
		},
		// STATIC
		{
			header: 'Interactable',
			description:
				'Static [ 🗿 ] means this Interactable cannot be controlled by the player. Try switching players (Press E or Q) and you will see that the bricks cannot be controlled.',
			veilHeight: 476,
			props: {
				id: 'static',
				emoji: 'brick',
				isStatic: true,
				evolve: new Evolve(false, '', 2),
				devolve: new Devolve(false, ''),
				hp: 1,
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_5', 'baby'],
						['155_3', 'brick'],
						['155_6', 'brick'],
						['155_9', 'brick'],
						['155_12', 'brick'],
						['155_7', 'baby'],
					]),
					-2
				),
				statics: new Set<string>(['brick']),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'static',
						new TInteractable(
							'brick',
							[],
							1,
							1,
							[['any', 0]],
							true,
							new Evolve(false, '', 2),
							new Devolve(false, '')
						),
					],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		// EVOLUTION (monkey with banana, eats 4 bananas, evolves to human)
		{
			header: 'Interactable',
			description:
				"Evolve [ 🧬 ], as the name suggests, makes the Interactable evolvable. When Interactable's HP reaches to evolve limit, the emoji transforms and HP resets to evolved version's [ man-walking ] HP. Which in this case is 1.",
			veilHeight: 476,
			props: {
				id: 'evolution',
				emoji: 'baby',
				isStatic: false,
				evolve: new Evolve(true, 'man-walking', 5),
				devolve: new Devolve(false, ''),
				hp: 1,
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_0', 'baby'],
						['155_10', 'baby-bottle'],
						['155_11', 'baby-bottle'],
						['155_14', 'baby-bottle'],
						['155_15', 'baby-bottle'],
					])
				),
				statics: new Set<string>(['baby-bottle']),
				consumables: new Map<number, Consumable>([
					[-1, { emoji: 'baby-bottle', hp: 1, mutateConsumerTo: '' }],
				]),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'evolution',
						new TInteractable(
							'baby',
							[],
							1,
							1,
							[],
							true,
							new Evolve(true, 'man-walking', 5),
							new Devolve(false, '')
						),
					],
				]),

				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		// DEVOLUTION (human eats 4 test-tube's devolves to rat)
		{
			header: 'Interactable',
			description:
				"It would be unfair to not have a devolve feature. When Interactable's HP reaches 0 it disappears, unless devolve is enabled. If devolve is enabled, same dynamics with evolve occurs.",
			veilHeight: 476,
			props: {
				id: 'devolution',
				emoji: 'monkey',
				evolve: new Evolve(false, '', 2),
				devolve: new Devolve(true, 'rat'),
				hp: 4,
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_0', 'monkey'],
						['155_10', 'test-tube'],
						['155_11', 'test-tube'],
						['155_14', 'test-tube'],
						['155_15', 'test-tube'],
					])
				),
				statics: new Set<string>(['test-tube']),
				consumables: new Map<number, Consumable>([
					[-2, { emoji: 'test-tube', hp: -1, mutateConsumerTo: '' }],
				]),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'devolution',
						new TInteractable(
							'monkey',
							[],
							4,
							1,
							[],
							true,
							new Evolve(false, '', 2),
							new Devolve(true, 'rat')
						),
					],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		// TODO: Prevent tutorial from changing section (if size == 4) dont
		// TODO: Better definiton
		// TODO: turn description text into html
		{
			header: 'Interactable',
			description:
				'Side Effects need two questions: "What is going to have side effects?" and "How much will it increase/decrease the HP?" In this example, the answers are "any" and "0" consecutively. Meaning, nothing can destroy that door, even that giant key.',
			veilHeight: 164,
			props: {
				id: 'sideEffects',
				emoji: 'door',
				isStatic: true,
				evolve: new Evolve(false, '', 2),
				devolve: new Devolve(false, ''),
				hp: 1,
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_0', 'monkey'],
						['155_2', 'door'],
						['155_6', 'brick'],
						['155_10', 'brick'],
						['155_12', 'key'],
						['155_14', 'brick'],
						['155_15', 'banana'],
					])
				),
				statics: new Set<string>(['brick', 'door', 'banana']),
				equippables: new Map<number, Equippable>([
					[69, new Equippable('key', 1)],
				]),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'sideEffects',
						new TInteractable(
							'door',
							[],
							1,
							1,
							[['any', 0]],
							true,
							new Evolve(false, '', 2),
							new Devolve(false, '')
						),
					],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		//SIDE EFFECTS CAN OPEN DOOR (door and monkey, interacting with "any" will be of no use, will have to use a key)
		{
			header: 'Interactable',
			description:
				"Look! A new side effect has been added. It says [ key ] and [ -1 ]. Let's see if we can open that door now 🧐.",
			veilHeight: 164,
			props: {
				id: 'sideEffects',
				emoji: 'door',
				isStatic: true,
				evolve: new Evolve(false, '', 2),
				devolve: new Devolve(false, ''),
				hp: 1,
				pseudoSideEffects: [['key', -1]],
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_0', 'monkey'],
						['155_2', 'door'],
						['155_6', 'brick'],
						['155_10', 'brick'],
						['155_12', 'key'],
						['155_14', 'brick'],
						['155_15', 'banana'],
					])
				),
				statics: new Set<string>(['brick', 'door', 'banana']),
				equippables: new Map<number, Equippable>([
					[69, new Equippable('key', 1)],
				]),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'sideEffects',
						new TInteractable(
							'door',
							[],
							1,
							1,
							[
								['any', 0],
								[69, -1],
							],
							true,
							new Evolve(false, '', 2),
							new Devolve(false, '')
						),
					],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
		// EVENT SEQUENCE (the level from equippable)
		{
			header: 'Interactable',
			description:
				"In the previous levels, interacting with the banana would end the game, why it doesn't right now? Let's fix that by adding a function to the Event Sequence!",
			veilHeight: 0,
			props: {
				id: 'sequence',
				sequence: [{ type: 'completeLevel' }],
				emoji: 'banana',
				isStatic: true,
				sideEffects: [['any', -1]],
				evolve: new Evolve(false, '', 2),
				devolve: new Devolve(false, ''),
				hp: 1,
			},
			gameProps: {
				map: new EditableMap(
					new Map<string, string>([
						['155_0', 'monkey'],
						['155_2', 'door'],
						['155_6', 'brick'],
						['155_10', 'brick'],
						['155_12', 'key'],
						['155_14', 'brick'],
						['155_15', 'banana'],
					])
				),
				statics: new Set<string>(['brick', 'door', 'banana']),
				equippables: new Map<number, Equippable>([
					[69, new Equippable('key', 1)],
				]),
				// @ts-expect-error
				interactables: new Map<number, TInteractable>([
					[
						'sequence',
						new TInteractable(
							'banana',
							// @ts-expect-error
							[{ type: 'completeLevel' }],
							1,
							1,
							[['any', -1]],
							true,
							new Evolve(false, '', 2),
							new Devolve(false, '')
						),
					],
					[
						'sideEffects',
						new TInteractable(
							'door',
							[],
							1,
							1,
							[
								['any', 0],
								[69, -1],
							],
							true,
							new Evolve(false, '', 2),
							new Devolve(false, '')
						),
					],
				]),
				mapClass: 'simulation',
				SIZE: 4,
			},
		},
	];
	let props = tutorialProps[index];
	$: props = tutorialProps[index];
</script>

<Tutorial {...props} {rbx} --header={INTERACTABLE_BORDER} />

<div class="absolute bottom-4 right-4 flex items-center justify-center gap-2">
	<p class="absolute -top-8 w-full">{index + 1} / {tutorialProps.length}</p>
	{#if index > 0}
		<button class="btn-lg btn" on:click={() => index--}>⮜</button>
	{/if}
	{#if index < tutorialProps.length - 1}
		<button class="btn-lg btn" on:click={() => index++}>⮞</button>
	{:else if index == tutorialProps.length - 1}
		<!-- The button to open modal -->
		<a href="#tutorial-complete" class="btn-lg btn">FINISH</a>
		<!-- Put this part before </body> tag -->
	{/if}
</div>
