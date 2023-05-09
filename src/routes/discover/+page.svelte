<script lang="ts">
	let filter: 'newest' | 'following' | 'search' = 'newest';
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
	<button
		on:click={() => (filter = 'search')}
		class="tab {filter === 'search' ? 'bg-accent text-accent-content' : ''}"
		>Search</button
	>
</div>
{#if filter == 'search'}
	<div class="flex flex-row gap-2">
		<form class="relative w-full" on:submit|preventDefault={search}>
			<input
				type="text"
				class="input-bordered input w-full"
				bind:value={query}
			/>
			<button class="absolute right-3 top-3"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
			</button>
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
{/if}
