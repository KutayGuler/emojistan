<script lang="ts">
	import {
		type Pusher as TPusher,
		EditableMap,
		Controllable,
		Evolve,
		Devolve,
	} from '$src/types';
	import { PUSHER_BG, PUSHER_BORDER, PUSHER_H, PUSHER_W } from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Pusher from '$rbx/Pusher.svelte';
	import type { TutorialProps } from '../types';
	import type { StringedNumber } from '$src/store';

	const tutorialProps: TutorialProps<Pusher> = {
		header: 'Pusher',
		description:
			'Pusher takes two emoji inputs and makes <i class="twa twa-leaf-fluttering-in-wind text-2xl"></i> pushable by <i class="twa twa-wind-face text-2xl"></i> ',
		component: Pusher,
		rbx: {
			id: '0',
			type: 'pusher',
			position: { x: 0, y: 0 },
			width: PUSHER_W,
			height: PUSHER_H,
			bgColor: PUSHER_BG,
			borderColor: PUSHER_BORDER,
		},
		props: {
			id: '-1',
			slots: ['wind-face', 'leaf-fluttering-in-wind', 'push'],
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_5', 'wind-face'],
					['0_6', 'leaf-fluttering-in-wind'],
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'0',
					new Controllable(
						'wind-face',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			pushers: new Map<StringedNumber, TPusher>([
				['0', ['wind-face', 'leaf-fluttering-in-wind', 'push']],
			]),
			mapClass: 'simulation',
			SIZE: 4,
			showHP: false,
			showInventory: false,
		},
	};
</script>

<svelte:head>
	<title>Emojistan | Tutorial - Pusher</title>
</svelte:head>

<Tutorial {...tutorialProps} --header={PUSHER_BORDER} />
