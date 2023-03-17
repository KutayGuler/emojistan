<script lang="ts">
	import { type Merger as TMerger, EditableMap } from '$src/types';
	import { MERGER_BG, MERGER_BORDER, MERGER_H, MERGER_W } from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Merger from '$rbx/Merger.svelte';

	const tutorialProps = {
		header: 'Merger',
		description:
			'Merger takes three emoji inputs. To put it simply, cloud + snowflake = cloud-with-snow. Alternatively, snowflake + cloud = cloud-with-snow',
		component: Merger,
		rbx: {
			id: 0,
			type: 'merger',
			position: { x: 0, y: 0 },
			width: MERGER_W,
			height: MERGER_H,
			bgColor: MERGER_BG,
			borderColor: MERGER_BORDER,
		},
		props: {
			id: -1,
			slots: ['cloud', 'snowflake', 'cloud-with-snow'],
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['155_5', 'cloud'],
					['155_6', 'snowflake'],
				]),
				-2
			),
			mergers: new Map<number, TMerger>([
				[0, ['cloud', 'snowflake', 'cloud-with-snow']],
			]),
			mapClass: 'simulation',
			SIZE: 4,
			showHP: false,
			showInventory: false,
		},
	};
</script>

<Tutorial {...tutorialProps} --header={MERGER_BORDER} />
