<script lang="ts">
	let favorites: Array<object> = [];

	export let data;
</script>

{#if favorites.length > 0}
	<p>favorites</p>
{:else}
	<i
		class="twa twa-red-heart absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/if}
