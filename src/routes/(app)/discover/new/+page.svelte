<script lang="ts">
	import Paginatable from '../../Paginatable.svelte';
	import GameCard from '../../GameCard.svelte';
	import type { PageData } from '../$types';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		const res = await data.supabase
			.from('games')
			.select('id, name, description, profile:profiles!games_user_id_fkey(username)')
			.order('created_at', { ascending: false })
			.range(from, to);

		return res;
	}
</script>

<Paginatable data={data.newGames} component={GameCard} {supabaseQuery} />
