<script lang="ts">
	export let following: Array<object> = [];
</script>

{#if following.length > 0}
	<p>following</p>
{:else}
	<i
		class="twa twa-face-with-monocle absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/if}
