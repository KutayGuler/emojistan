<script lang="ts">
	import {
		mergers,
		pushers,
		interactables,
		effectors,
		controllables,
		sequencers,
		type StringedNumber,
	} from '../store';
	import type { RuleboxType } from '$lib/types';
	import { rbxStore } from '$lib/stores/store';
	import {
		Devolve,
		Evolve,
		Interactable,
		Controllable,
		Effector,
		Sequencer,
	} from '$src/types';

	export let position: { x: number; y: number };

	// CF #4
	function spawn(component: RuleboxType, value: any) {
		const id = rbxStore.spawn(component, position);

		switch (component) {
			case 'pusher':
				pushers.add(id, value);
				break;
			case 'merger':
				mergers.add(id, value);
				break;
			case 'effector':
				effectors.add(id, value);
				break;
			case 'controllable':
				controllables.add(id, value);
				break;
			case 'interactable':
				interactables.add(id, value);
				break;
			case 'sequencer':
				sequencers.add(id, value);
				break;
			case 'ctxMenu':
				break;
		}
	}

	// CF #5
	let menuItems = [
		{
			name: 'Pusher',
			onClick: () => spawn('pusher', ['', '', 'push']),
		},
		{
			name: 'Merger',
			onClick: () => spawn('merger', ['', '', '']),
		},
		{
			name: 'Effector',
			onClick: () => spawn('effector', new Effector('', 1)),
		},
		{
			name: 'Controllable',
			onClick: () =>
				spawn(
					'controllable',
					new Controllable('', 1, [], new Evolve('', 2), new Devolve(''))
				),
		},
		{
			name: 'Interactable',
			onClick: () =>
				spawn(
					'interactable',
					new Interactable(
						'',
						'-1',
						1,
						[['any', 'talk']],
						new Map<StringedNumber | "any", StringedNumber>(),
						new Evolve('', 2),
						new Devolve(''),
						['-1', 0]
					)
				),
		},
		{
			name: 'Sequencer',
			onClick: () =>
				spawn('sequencer', new Sequencer('Event_' + $sequencers.size, [])),
		},
	];
</script>

<ul class="w-full bg-white">
	{#each menuItems as { name, onClick }}
		<button
			class="{name} box-border h-8 w-full p-1 text-start"
			on:click={onClick}
		>
			{name}
		</button>
	{/each}
</ul>
