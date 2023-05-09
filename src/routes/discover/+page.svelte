<script lang="ts">
	import type { Database } from '$api/types';

	let filter: 'newest' | 'following' = 'newest';
	let searchType: 'games' | 'users' = 'games';
	let query = '';

	function search() {}

	let response = [{ name: '', user_id: '' }];
</script>

<h1 class="text-6xl text-accent">Discover</h1>
<div class="tabs tabs-boxed py-3">
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
<div class="flex flex-row gap-2">
	<form class="w-full" on:submit|preventDefault={search}>
		<input type="text" class="input-bordered input w-full" bind:value={query} />
	</form>
	<select class="select-bordered select" bind:value={searchType}>
		<option value="games">Games</option>
		<option value="users">Users</option>
	</select>
	<i
		class="twa text-4xl twa-{searchType == 'games'
			? 'joystick'
			: 'alien-monster'}"
	/>
</div>
