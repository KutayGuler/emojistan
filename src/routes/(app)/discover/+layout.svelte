<script lang="ts">
	import { page } from '$app/stores';
	const tabs = ['New', 'Following', 'Search'];
</script>

<svelte:head>
	<title>Emojistan | Discover</title>
	<meta
		name="description"
		content="Discover what other players have made in Emojistan."
	/>
</svelte:head>

<div class="flex h-full flex-col">
	<h1 class="text-6xl text-accent">Discover</h1>
	<div class="tabs tabs-boxed py-3">
		{#each tabs as _tab}
			{@const tab = _tab.toLowerCase()}
			<a
				href="/discover/{tab}"
				class="tab {$page.route.id?.includes(tab)
					? 'brutal bg-accent text-accent-content'
					: ''}">{_tab}</a
			>
		{/each}
	</div>

	<slot />
</div>
