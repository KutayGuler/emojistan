<script lang="ts">
	import Paginatable from '$src/routes/(app)/Paginatable.svelte';
	import type { PageData } from '../$types';
	import ProfileCard from '$src/routes/(app)/ProfileCard.svelte';
	export let data: PageData;

	async function supabaseQuery(from: number, to: number) {
		const res = await data.supabase
			.from('follows')
			.select(
				'follower_id, profile:profiles!follows_follower_id_fkey(username)'
			)
			.eq('following_id', data.profileData.id)
			.range(from, to);

		return res;
	}
</script>

<Paginatable
	wrap
	data={data.follower.data}
	component={ProfileCard}
	{supabaseQuery}
>
	<i
		class="twa twa-detective absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
</Paginatable>
