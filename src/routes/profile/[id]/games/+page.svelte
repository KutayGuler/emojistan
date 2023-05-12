<script lang="ts">
	export let games: Array<object> = [];
</script>

{#if games.length > 0}
	<p>games</p>
{:else}
	<i
		class="twa twa-floppy-disk absolute scale-150 self-center pt-[50%] text-9xl opacity-25"
	/>
{/if}
