<script lang="ts">
	import { fly } from 'svelte/transition';

	let filter: 'newest' | 'following' | 'favorites' = 'newest';
</script>

<div
	in:fly={{ x: 100 }}
	class="z-10 h-full flex-grow rounded bg-base-200 bg-opacity-95 p-8 text-accent"
>
	<h1 class="text-6xl">Discover</h1>
	<div class="tabs tabs-boxed pt-4">
		<button
			on:click={() => (filter = 'newest')}
			class="tab {filter === 'newest' ? 'bg-accent text-accent-content' : ''}"
			>Newest</button
		>
		<button
			on:click={() => (filter = 'following')}
			class="tab {filter === 'following'
				? 'bg-accent text-accent-content'
				: ''}">Following</button
		>
		<button
			on:click={() => (filter = 'favorites')}
			class="tab {filter === 'favorites'
				? 'bg-accent text-accent-content'
				: ''}">Favorites</button
		>
	</div>
</div>
