<script lang="ts">
	import GameCard from '$src/routes/(app)/GameCard.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	// TODO: intersection observer

</script>

{#each data?.likes?.data || [] as { game: { id, name }, profile }, index}
	<GameCard {index} {id} {name} {profile} emojis={new Set()} />
{:else}
	<i
		class="twa twa-red-heart absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/each}
