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
	<h3>{name}</h3>

	<div class="flex flex-row gap-2">
		{#each [...emojis.keys()] as emoji}
			<i class="twa text-4xl twa-{emoji}" />
		{/each}
	</div>
	<div class="flex flex-grow" />
	<div class="flex flex-row justify-between">
		{#if profile}
			<a
				href="/profile/{profile.username}"
				class="btn-ghost btn-sm btn flex gap-2 rounded-l-full border-none pl-0 hover:border-none"
			>
				<div class="placeholder avatar">
					<div class="w-8 rounded-full bg-neutral text-neutral-content">
						<i class="twa twa-alien text-lg" />
					</div>
				</div>
				<div>
					{profile.username}
				</div>
			</a>
		{/if}
		<a href="/games/{id}" class="btn-sm btn self-end">PLAY</a>
	</div>
</div>
