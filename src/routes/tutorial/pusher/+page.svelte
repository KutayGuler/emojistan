<script lang="ts">
	import { type Pusher as TPusher, EditableMap } from '$src/types';
	import { PUSHER_BG, PUSHER_BORDER, PUSHER_H, PUSHER_W } from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Pusher from '$rbx/Pusher.svelte';

	const tutorialProps = {
		header: 'Pusher',
		description:
			'Pusher takes two emoji inputs and makes leaf-fluttering-in-wind pushable by wind-face',
		component: Pusher,
		rbx: {
			id: 0,
			type: 'pusher',
			position: { x: 0, y: 0 },
			width: PUSHER_W,
			height: PUSHER_H,
			bgColor: PUSHER_BG,
			borderColor: PUSHER_BORDER,
		},
		props: {
			id: -1,
			slots: ['wind-face', 'leaf-fluttering-in-wind', 'push'],
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['155_5', 'wind-face'],
					['155_6', 'leaf-fluttering-in-wind'],
				]),
				-2
			),
			pushers: new Map<number, TPusher>([
				[0, ['wind-face', 'leaf-fluttering-in-wind', 'push']],
			]),
			mapClass: 'simulation',
			SIZE: 4,
			showHP: false,
			showInventory: false,
		},
	};
</script>

<Tutorial {...tutorialProps} --header={PUSHER_BORDER} />
