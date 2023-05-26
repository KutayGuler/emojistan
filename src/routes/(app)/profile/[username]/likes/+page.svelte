<script lang="ts">
	import Paginatable from '$src/routes/(app)/Paginatable.svelte';
	import GameCard from '$src/routes/(app)/GameCard.svelte';
	import type { PageData } from '../$types';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		let res = await data.supabase
			.from('likes')
			.select('games(id, name), profile:profiles(username)')
			.eq('liker_id', data.profileData.id)
			.order('created_at', { ascending: false })
			.range(from, to);

		if (res.data) {
			res.data = res.data?.map(({ games, profile }) => ({
				id: games.id,
				name: games.name,
				profile,
			}));
		}

		return res;
	}
</script>

<Paginatable data={data.likes.data} component={GameCard} {supabaseQuery}>
	<i
		slot="fallback"
		class="twa twa-red-heart absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
</Paginatable>
