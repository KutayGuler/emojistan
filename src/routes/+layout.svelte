<script lang="ts">
	import Toast from './Toast.svelte';
	import { navigating } from '$app/stores';
	import '../app.css';
	import '../twemoji.css';
	import supabase from '../supabase';
	import Modal from './Modal.svelte';
	import { currentSkin, showLoading } from '$src/store';
	import { xd } from './editor/xd';
	import Loading from './Loading.svelte';

	supabase.auth.onAuthStateChange((event, session) => {});

	// $showLoading = true;
	// function waitForEmojisLoad(node: Element) {
	// 	for (let child of Array.from(node.children)) {
	// 		const img = new Image();
	// 		img.src = getComputedStyle(child).backgroundImage.replace(
	// 			/(^url\()|(\)$|[\"\'])/g,
	// 			''
	// 		);

	// 		img.addEventListener('load', () => {
	// 			console.log(svgCount++);
	// 			if (svgCount >= 1817) {
	// 				$showLoading = false;
	// 			}
	// 		});
	// 	}
	// }

	let svgCount = 0;
</script>

<!-- <div class="hidden">
	{#each Object.keys(xd) as category}
		<div use:waitForEmojisLoad>
			{#each xd[category] as name}
				<i
					on:load={() => {
						console.log('loaded:', svgCount++);
					}}
					class="twa twa-{name.replace('_', $currentSkin)}"
				/>
			{/each}
		</div>
	{/each}
</div> -->

{#if $showLoading || ($navigating && !$navigating.from?.route.id?.includes('tut'))}
	<Loading />
{/if}

<Toast />

<slot />

<Modal />
