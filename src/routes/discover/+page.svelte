<script lang="ts">
	let filter: 'newest' | 'following' = 'newest';
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
</div>
