<script lang="ts">
	import supabase from '$api/supabase';
	import { page } from '$app/stores';
	import GameCard from '$src/routes/(app)/GameCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	let lastRange = 10;

	async function getGames() {
		let { data: games, error } = await supabase
			.from('games')
			.select('id, name')
			.eq('username', $page.params.username)
			.range(lastRange, lastRange + 10);

		lastRange += 10;

		return games;
	}

	// TODO: intersection observer

	// getGames();
</script>

{#each data?.games?.data || [] as { id, name, profile }, index}
	<GameCard {index} {id} {name} {profile} emojis={new Set()} />
{:else}
	<i
		class="twa twa-floppy-disk absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/each}
