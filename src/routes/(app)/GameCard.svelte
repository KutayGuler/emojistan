<script lang="ts">
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { liked_game_ids } from '$src/store';
	export let index = 0;
	export let id: string;
	export let name: string;
	export let profile: any;
	export let emojis = new Set<string>();
	export let div: HTMLDivElement | null = null;
	let liked = $liked_game_ids.has(id);

	let loading = false;

	// TODO: player should be able to download their published games

	async function toggleLike() {
		if (loading) return;
		liked = !liked;
		loading = true;

		if (!liked) {
			const { data, error } = await $page.data.supabase
				.from('likes')
				.delete()
				.match({ liker_id: $page.data.session?.user.id, game_id: id });

			$liked_game_ids.delete(id);
		} else {
			const { data, error } = await $page.data.supabase
				.from('likes')
				.insert({ game_id: id, liker_id: $page.data.session?.user.id });

			$liked_game_ids.add(id);
		}

		loading = false;
	}
</script>

<div
	bind:this={div}
	id="card"
	in:fly={{ delay: (index + 1) * 80, x: 200 }}
	class="brutal relative mb-2 flex flex-col rounded-lg bg-slate-300 p-4 text-neutral"
>
	<h3>{name}</h3>
	<p class="text-md text-slate-500">
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
		doloribus unde quae? Soluta vel deserunt ipsam aliquam amet esse officia
		impedit, illum est, vitae placeat?
	</p>
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
		<div class="flex items-center gap-2">
			{#if $page.data.session}
				<button on:click={toggleLike}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill={liked ? 'red' : 'none'}
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke={liked ? 'none' : 'currentColor'}
						class="h-8 w-8"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
						/>
					</svg>
				</button>
			{/if}
			<a href="/games/{id}" class="btn-sm btn self-end">PLAY</a>
		</div>
	</div>
</div>

<style>
	#card {
		min-height: 224px;
	}
</style>
