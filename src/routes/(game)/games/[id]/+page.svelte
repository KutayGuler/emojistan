<script lang="ts">
	import { page } from '$app/stores';
	import supabase from '$api/supabase';
	import Game from '$src/views/Game.svelte';
	import Loading from '$src/routes/Loading.svelte';
	import type { GameProps } from '$src/routes/tutorial/types';

	async function getGameData() {
		let { data, error } = await supabase
			.from('games')
			.select('data')
			.eq('id', $page.params.id);

		let gameData = data[0].data as GameProps;

		if (error) {
			throw error;
		} else if (data && data[0]) {
			for (let [key, val] of Object.entries(gameData)) {
				if (key == 'map') continue;
				gameData[key] = new Map(Object.entries(val));
			}

			for (let [key, val] of Object.entries(gameData.map)) {
				if (key == 'dbg') continue;
				gameData.map[key] = new Map(Object.entries(val));
			}
			gameData.map.ssi = 0;
			console.log(gameData);

			return gameData;
		}
	}

	console.log($page.route.id);
</script>

{#await getGameData()}
	<Loading />
{:then data}
	<!-- <p>{JSON.stringify(data)}</p> -->
	<div class="flex h-screen flex-col items-center justify-center">
		<Game {...data} />
	</div>
{:catch error}
	<p>Could not get game data.</p>
{/await}
