<script lang="ts">
	import Paginatable from '../../Paginatable.svelte';
	import GameCard from '../../GameCard.svelte';
	import supabase from '$api/supabase';
	import type { PageData } from '../$types';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		// const res = await supabase
		// 	.from('games')
		// 	.select('name, id, profile:profiles!games_user_id_fkey(username)')
		// 	.in('user_id', data.profileData.id)
		// 	.order('created_at', { ascending: false })
		// 	.range(from, to);

		// TODO: following users should be kept track of

		// return res;
		return [];
	}
</script>

<Paginatable data={data.followingGames} component={GameCard} {supabaseQuery}>
	<div slot="fallback">Login to see the games of people you follow.</div>
</Paginatable>
