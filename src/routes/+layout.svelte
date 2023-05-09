<script lang="ts">
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import { navigating } from '$app/stores';
	import Modal from './Modal.svelte';
	import Loading from './Loading.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	// import { tweened } from 'svelte/motion';
	// import { cubicOut } from 'svelte/easing';
	// const progress = tweened(0, {
	// 	duration: 100,
	// 	easing: cubicOut,
	// });

	// supabase.auth.onAuthStateChange((event, session) => {});

	// const TOTAL_SVG_COUNT = 1817;
	// let svgCount = 0;

	// function waitForEmojisLoad(node: Element) {
	// 	if ($loadedEmojis) return;
	// 	for (let child of Array.from(node.children)) {
	// 		const img = new Image();
	// 		img.src = getComputedStyle(child).backgroundImage.replace(
	// 			/(^url\()|(\)$|[\"\'])/g,
	// 			''
	// 		);

	// 		img.addEventListener('load', () => {
	// 			svgCount += 1;
	// 			progress.set(svgCount / TOTAL_SVG_COUNT);
	// 			if (svgCount >= TOTAL_SVG_COUNT) {
	// 				$loadedEmojis = true;
	// 			}
	// 		});
	// 	}
	// }
</script>

<!-- <div class="hidden">
	{#each Object.keys(emojis) as category}
		<div use:waitForEmojisLoad>
			{#each emojis[category] as name}
				<i
					on:load={() => {}}
					class="twa twa-{name.replace('_', $currentSkin)}"
				/>
			{/each}
		</div>
	{/each}
</div> -->

{#if $navigating && !$navigating.from?.route.id?.includes('tut')}
	<Loading />
{/if}

<Toast />

<slot />

<Modal />
