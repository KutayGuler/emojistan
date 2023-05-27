<script lang="ts">
	import Paginatable from '$src/routes/(app)/Paginatable.svelte';
	import GameCard from '$src/routes/(app)/GameCard.svelte';
	import type { PageData } from '../$types';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		let res = await data.supabase
			.from('games')
			.select('id, name, description, profile:profiles!games_user_id_fkey(username)', {
				count: 'exact',
			})
			.eq('user_id', data.profileData?.id)
			.range(from, to);

		return res;
	}
</script>

<Paginatable data={data.games.data} component={GameCard} {supabaseQuery}>
	<i
		slot="fallback"
		class="twa twa-floppy-disk absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
</Paginatable>
