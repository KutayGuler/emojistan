<script lang="ts">
	import ProfileCard from '$src/routes/(app)/ProfileCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="flex flex-wrap gap-2">
	{#each data?.following?.data || [] as { profile }}
		<ProfileCard username={profile.username} />
	{:else}
		<i
			class="twa twa-face-with-monocle absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
		/>
	{/each}
</div>
