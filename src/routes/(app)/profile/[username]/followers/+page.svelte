<script lang="ts">
	import UserCard from '$src/routes/(app)/UserCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-wrap gap-2">
	{#each data?.follower?.data || [] as { profile }}
		<UserCard username={profile.username} />
	{:else}
		<i
			class="twa twa-detective absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
		/>
	{/each}
</div>
