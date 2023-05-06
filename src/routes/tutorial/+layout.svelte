<script lang="ts">
	import {
		PUSHER_BORDER,
		MERGER_BORDER,
		EFFECTOR_BORDER,
		INTERACTABLE_BORDER,
		CONTROLLABLE_BORDER,
	} from '../../constants';
	import { page } from '$app/stores';

	function capitalizeFirst(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	interface Rulebox {
		link: string;
		next?: string;
		color?: string;
	}

	const ruleboxes: { [key: string]: Rulebox } = {
		ruleboxes: {
			link: 'ruleboxes',
			next: 'pusher',
		},
		pusher: {
			link: 'pusher',
			color: PUSHER_BORDER,
			next: 'merger',
		},
		merger: {
			link: 'merger',
			color: MERGER_BORDER,
			next: 'effector',
		},
		effector: {
			link: 'effector',
			color: EFFECTOR_BORDER,
			next: '',
		},
		controllable: {
			link: 'controllable',
			color: CONTROLLABLE_BORDER,
			next: '',
		},
		interactable: {
			link: 'interactable',
			color: INTERACTABLE_BORDER,
			next: '',
		},
		editor: {
			link: 'editor',
			color:
				'linear-gradient(90deg, rgba(168,85,247,0.5) 0%, rgba(34,197,94,0.5) 50%, rgba(244,63,94,0.5) 100%)',
			next: '',
		},
	};

	// FIXME: Focus getting stuck after clicking on next tutorial link

	let rulebox = ruleboxes[$page.url.pathname.split('/')[2]];
	$: rulebox = ruleboxes[$page.url.pathname.split('/')[2]];
</script>

<main class="flex flex-row bg-white">
	<div class="drawer-mobile drawer">
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col items-center justify-start">
			<slot />
		</div>
		{#if rulebox?.next}
			<a
				href={'/tutorial/' + rulebox.next}
				class="btn-lg btn absolute bottom-4 right-4">{rulebox.next} ⮞</a
			>
		{/if}
		{#if $page.url.pathname.includes('controls')}
			<a href="/tutorial/ruleboxes" class="btn-lg btn absolute bottom-4 right-4"
				>Ruleboxes ⮞</a
			>
		{/if}
		<div class="drawer-side">
			<label for="my-drawer-2" class="drawer-overlay" />
			<ul
				class="brutal menu m-4 w-96 rounded-md bg-neutral text-neutral-content"
			>
				<li
					class={$page.url.pathname.includes('controls') ? 'bg-base-300' : ''}
				>
					<a href="../tutorial/controls">Controls</a>
				</li>
				{#each Object.values(ruleboxes) as { link, color }}
					<li
						class={capitalizeFirst(link)}
						style={$page.url.pathname.includes(link)
							? `background: ${color}; color: var(--primary);`
							: ''}
					>
						<a href="../tutorial/{link}">{capitalizeFirst(link)}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</main>

<div class="modal" id="tutorial-complete">
	<div class="modal-box">
		<h3 class="font-bold">Congratulations!</h3>
		<p class="py-4">
			You have completed the tutorial. Now it's time to create your own games!
		</p>
		<div class="modal-action">
			<a href="../../" class="btn">YAY!</a>
		</div>
	</div>
</div>
