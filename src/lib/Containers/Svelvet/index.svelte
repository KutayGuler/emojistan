<!--Note: Import / export in svelvet is used for passing props  -->
<script lang="ts">
	import GraphView from '$lib/Containers/GraphView/index.svelte';
	import { GRAPH_SIZE_2XL, GRAPH_SIZE_MD } from '$src/constants';
	import { onMount } from 'svelte';

	let graphSize: number;
	let innerWidth: number;

	function resize() {
		if (innerWidth >= 1536) {
			graphSize = GRAPH_SIZE_2XL;
		} else if (innerWidth >= 768) {
			graphSize = GRAPH_SIZE_MD;
		} else {
			graphSize = innerWidth / 2.13;
		}
	}

	onMount(resize);
</script>

<svelte:window bind:innerWidth on:resize={resize} />
<!-- Now that a store has been created from the initial nodes and initial edges we drill props from the store down to the D3 GraphView along with the unique key -->
<div
	class="Svelvet shadow-xl"
	style={`width: ${graphSize}px; height: ${graphSize}px`}
>
	<GraphView {graphSize} />
	<p class="absolute bottom-0 right-0 hidden pr-1 text-xs md:block">
		Right click to spawn a Rulebox
	</p>
	<p class="absolute bottom-0 right-0 block pr-1 text-xs md:hidden">
		Hold on canvas to spawn a Rulebox
	</p>
	<p class="absolute bottom-0 left-0 hidden pl-1 text-xs md:block">
		Press R to unstuck
	</p>
</div>

<style>
	.Svelvet {
		position: relative;
		overflow: hidden;
		display: grid;
		font-family: 'Segoe UI', sans-serif;
		background-color: 'white';
	}
</style>
