<script lang="ts">
	import { page } from '$app/stores';
	import Game from '$src/views/Game.svelte';
	import Loading from '$src/routes/Loading.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	async function getGameData() {
		let { data: _data, error } = await data.supabase
			.from('games')
			.select('data')
			.eq('id', $page.params.id);

		let gameData: any = _data[0].data;
		console.log(gameData);

		if (error) {
			throw error;
		} else if (gameData) {
			for (let [key, val] of Object.entries(gameData)) {
				if (key == 'map') continue;
				gameData[key] = new Map(val);
			}

			for (let [key, val] of Object.entries(gameData.map)) {
				console.log(val);
				if (key == 'dbg' || key == 'ssi') continue;
				gameData.map[key] = new Map(val);
			}

			gameData.map.ssi = parseInt(gameData.map.ssi);

			console.log(gameData);
			return gameData;
		}
	}
</script>

{#await getGameData()}
	<Loading />
{:then gameData}
	<main
		class="editor relative box-border flex h-screen flex-col items-center justify-center overflow-hidden"
	>
		<Game {...gameData} />
	</main>
{:catch error}
	<p class="p-1">Oops! Failed to get the game data.</p>
{/await}
