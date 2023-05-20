<script lang="ts">
	import ProfileCard from '../../../ProfileCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	// TODO: intersection observer

</script>

<div class="flex flex-wrap gap-2">
	{#each data?.follower?.data || [] as { profile }}
		<ProfileCard username={profile.username} />
	{:else}
		<i
			class="twa twa-detective absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
		/>
	{/each}
</div>
