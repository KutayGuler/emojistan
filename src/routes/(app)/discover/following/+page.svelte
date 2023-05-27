<script lang="ts">
	import Paginatable from '../../Paginatable.svelte';
	import GameCard from '../../GameCard.svelte';
	import type { PageData } from '../$types';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		const res = await data.supabase
			.from('games')
			.select('id, name, description, profile:profiles!games_user_id_fkey(username)')
			.in('user_id', data.following_ids)
			.range(0, 9);

		return res;
	}
</script>

{#if data.session}
	<Paginatable
		data={data.followingGames}
		component={GameCard}
		{supabaseQuery}
	/>
{:else}
	<div>Login to see the games of people you follow.</div>
{/if}
