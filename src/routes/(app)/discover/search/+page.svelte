<script lang="ts">
	import supabase from '$api/supabase';
	import GameCard from '../../GameCard.svelte';
	import ProfileCard from '../../ProfileCard.svelte';

	let searchType: 'games' | 'profiles' = 'games';
	let query = '';
	let searchResult: Array<object> = [];
	let searching = false;
	let searchError = false;
	let cache = new Map<string, object>();

	async function search() {
		console.log(cache);
		let cacheResult = cache.get(query.toLowerCase());
		if (cacheResult) {
			// @ts-expect-error
			searchResult = cacheResult;
			return;
		}

		searchError = false;
		searching = true;
		let column = searchType == 'games' ? 'name' : 'username';

		const { data, error } = await supabase
			.from(searchType)
			.select()
			.textSearch(column, query);

		searching = false;

		if (error) {
			searchError = true;
			searchResult = [];
		} else if (data) {
			cache.set(query.toLowerCase(), data);
			searchResult = data;
		}
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-row gap-2">
		<form class="relative w-full" on:submit|preventDefault={search}>
			<input
				type="text"
				class="input-bordered input w-full"
				bind:value={query}
				required
			/>
			<button
				class="btn-ghost btn-sm btn absolute right-0.5 h-full border-none hover:border-none"
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
			<option value="profiles">Profiles</option>
		</select>
		<i
			class="twa text-4xl twa-{searchType == 'games'
				? 'joystick'
				: 'alien-monster'}"
		/>
	</div>
	{#if searching}
		Searching...
	{:else if searchError}
		An error occured. Please try again later
	{:else if searchResult.length > 0}
		{#each searchResult as result, index}
			{#if searchType == 'games'}
				<GameCard {index} {...result} />
			{:else if searchType == 'profiles'}
				<ProfileCard {...result} />
			{/if}
		{/each}
	{/if}
</div>
