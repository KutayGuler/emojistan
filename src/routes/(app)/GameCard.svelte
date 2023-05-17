<script lang="ts">
	import { fly } from 'svelte/transition';

	export let index: number;
	export let id: string;
	export let name: string;
	export let profile: any;
	export let emojis: Set<string>;
</script>

<div
	in:fly={{ delay: (index + 1) * 80, x: 200 }}
	class="brutal relative mb-2 flex h-56 flex-col rounded-lg bg-slate-300 p-4 text-neutral"
>
	<div class="flex flex-col gap-2 pb-4">
		<h3>{name}</h3>
		{#if profile}
			<a href="/profile/{profile.username}" class="link">{profile.username}</a>
		{/if}
	</div>
	<p>
		{#each [...emojis.keys()] as emoji}
			<i class="twa text-4xl twa-{emoji}" />
		{/each}
	</p>
	<div class="flex flex-grow" />
	<a href="/games/{id}" class="btn-sm btn self-end">PLAY</a>
</div>
