<script lang="ts">
	import GameCard from '../../GameCard.svelte';
	export let data;
</script>

{#if data.games}
	<div class="h-full overflow-y-auto overflow-x-hidden px-1">
		{#each data.games as { id, name, profile }, index}
			<GameCard {index} {id} {name} {profile} emojis={new Set()} />
		{/each}
	</div>
{/if}
