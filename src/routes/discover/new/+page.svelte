<script lang="ts">
	export let data;
</script>

{#if data.games}
	{#each data.games as game}
		{JSON.stringify(game)}
	{/each}
{/if}
