<script lang="ts">
	import IntersectionObserver from 'svelte-intersection-observer';
	import GameCard from '../../GameCard.svelte';
	import supabase from '$api/supabase';
	export let data;

	let paginating = false;
	let intersecting: boolean;
	let element: HTMLDivElement;
	let paginationCount = 9;
	let paginatedIndexes: Array<number> = [];

	async function paginate() {
		if (paginating || paginatedIndexes.includes(data.newGames.length - 1)) {
			return;
		}

		paginating = true;
		paginatedIndexes.push(data.newGames.length - 1);

		let { data: newGames, error } = await supabase
			.from('games')
			.select('id, name, profile:profiles!games_user_id_fkey(username)')
			.order('created_at', { ascending: false })
			.range(paginationCount + 1, paginationCount + 10);

		paginationCount += 10;
		paginating = false;

		if (Array.isArray(newGames)) {
			data.newGames = [...data.newGames, ...newGames];
		}

		// TODO: error
	}
</script>

{#if data.newGames}
	<div class="h-full overflow-y-auto overflow-x-hidden px-1">
		{#each data.newGames as { id, name, profile }, index}
			{#if index == data.newGames.length - 1}
				<GameCard {id} {name} {profile} emojis={new Set()} bind:div={element} />
			{:else}
				<GameCard {id} {name} {profile} emojis={new Set()} />
			{/if}
		{/each}
	</div>

	<IntersectionObserver
		{element}
		bind:intersecting
		on:intersect={paginate}
		threshold={1}
	/>

	{#if paginating}
		<button
			class="loading btn-ghost btn-lg btn scale-150 border-none hover:border-none"
		/>
	{/if}
{/if}
