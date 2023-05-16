<script lang="ts">
	export let data;

	async function getFollowingGames() {
		// TODO: Relational stuff in db
		// TODO: implement this
	}
</script>

{#if !data.session?.user.id}
	login to see the games of people you follow
{:else}
	{#await getFollowingGames()}
		games loading.
	{:then games}
		games loaded.
	{/await}
{/if}
