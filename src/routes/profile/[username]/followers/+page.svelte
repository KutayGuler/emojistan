<script lang="ts">
	export let followers: Array<object> = [];
</script>

{#if followers.length > 0}
	<p>followers</p>
{:else}
	<i
		class="twa twa-detective absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/if}
