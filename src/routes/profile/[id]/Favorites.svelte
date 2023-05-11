<script lang="ts">
	export let favorites: Array<object> = [];
</script>

{#if favorites.length > 0}
	<p>favorites</p>
{:else}
	<p>You do not have any favorites.</p>
	<i
		class="twa twa-red-heart absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/if}
