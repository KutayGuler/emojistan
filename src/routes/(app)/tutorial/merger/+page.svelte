<script lang="ts">
	import {
		type Merger as TMerger,
		EditableMap,
		Controllable,
		Devolve,
		Evolve,
	} from '$src/types';
	import { MERGER_BG, MERGER_BORDER, MERGER_H, MERGER_W } from '$src/constants';
	import Tutorial from '../Tutorial.svelte';
	import Merger from '$rbx/Merger.svelte';
	import type { TutorialProps } from '../types';
	import type { StringedNumber } from '$src/store';

	const tutorialProps: TutorialProps = {
		header: 'Merger',
		description:
			'Merger takes three emoji inputs. To put it simply, <i class="twa twa-cloud text-2xl" /> + <i class="twa twa-snowflake text-2xl" /> = <i class="twa twa-cloud-with-snow text-2xl" />. Alternatively, <i class="twa twa-cloud text-2xl" /> = <i class="twa twa-cloud-with-snow text-2xl" />',
		component: Merger,
		rbx: {
			id: '-1',
			type: 'merger',
			position: { x: 0, y: 0 },
			width: MERGER_W,
			height: MERGER_H,
			bgColor: MERGER_BG,
			borderColor: MERGER_BORDER,
		},
		props: {
			id: '-1',
			slots: ['cloud', 'snowflake', 'cloud-with-snow'],
		},
		gameProps: {
			map: new EditableMap(
				new Map<string, string>([
					['0_5', 'cloud'],
					['0_6', 'snowflake'],
				])
			),
			controllables: new Map<StringedNumber, Controllable>([
				[
					'0',
					new Controllable(
						'cloud',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
				[
					'1',
					new Controllable(
						'snowflake',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
				[
					'2',
					new Controllable(
						'cloud-with-snow',
						1,
						[['any', 0]],
						new Evolve('', 0),
						new Devolve('')
					),
				],
			]),
			mergers: new Map<StringedNumber, TMerger>([
				['4', ['cloud', 'snowflake', 'cloud-with-snow']],
			]),
			mapClass: 'simulation',
			SIZE: 4,
			showHP: false,
			showInventory: false,
		},
	};
</script>

<svelte:head>
	<title>Emojistan | Tutorial - Merger</title>
</svelte:head>

<Tutorial {...tutorialProps} --header={MERGER_BORDER}>
	<p slot="description">
		Merger takes three emoji inputs. To put it simply, <br />
		<i class="twa twa-cloud text-2xl" />
		+
		<i class="twa twa-snowflake text-2xl" /> =
		<i class="twa twa-cloud-with-snow text-2xl" />
		<br /><br />
		Alternatively, &nbsp;<i class="twa twa-cloud text-2xl" />
		= <i class="twa twa-cloud-with-snow text-2xl" />
	</p>
</Tutorial>
