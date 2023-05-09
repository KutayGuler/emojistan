<script lang="ts">
	let filter: 'newest' | 'following' | 'favorites' = 'newest';
</script>

<h1 class="text-6xl text-accent">Discover</h1>
<div class="tabs tabs-boxed pt-4">
	<button
		on:click={() => (filter = 'newest')}
		class="tab {filter === 'newest' ? 'bg-accent text-accent-content' : ''}"
		>Newest</button
	>
	<button
		on:click={() => (filter = 'following')}
		class="tab {filter === 'following' ? 'bg-accent text-accent-content' : ''}"
		>Following</button
	>
	<button
		on:click={() => (filter = 'favorites')}
		class="tab {filter === 'favorites' ? 'bg-accent text-accent-content' : ''}"
		>Favorites</button
	>
</div>
