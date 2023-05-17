<script lang="ts">
	import supabase from '$api/supabase';
	import { page } from '$app/stores';

	// TODO: make a game component

	// async function getGames() {
	// 	let { data: games, error } = await supabase
	// 		.from('games')
	// 		.select('id, name')
	// 		.eq('username', $page.params.username);

	// 	return games;
	// }

	// getGames();
</script>

<!-- {#await getGames()}
	loading...
{:then games}
	{#each games as game}
		{JSON.stringify(game)}
	{:else}
		<i
			class="twa twa-floppy-disk absolute scale-150 self-center pt-[50%] text-9xl opacity-25"
		/>
	{/each}
{:catch error}
	{error}
{/await} -->
