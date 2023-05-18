<script lang="ts">
	import GameCard from '../../GameCard.svelte';
	export let data;
</script>

{#if !data.session?.user.id}
	Login to see the games of people you follow.
{:else if data?.followingGames}
	{#each data.followingGames as { id, name, profile }, index}
		<GameCard {index} {id} {name} {profile} emojis={new Set()} />
	{/each}
{/if}
