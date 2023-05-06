<script lang="ts">
	import supabase from '../supabase';
	import {
		map,
		pushers,
		mergers,
		interactables,
		effectors,
		dialogueTree as dialogue,
		controllables,
		saves,
	} from '../store';
	import { rbxStore } from '$lib/stores/store';
	import Saves from './Saves.svelte';
	import { onMount } from 'svelte';
	import Background from './Background.svelte';
	import Discover from './Discover.svelte';
	export let emojiFreqs = new Map<string, Set<string>>();

	onMount(() => {
		if ($saves.currentSaveID === '') saves.useStorage();
		for (let [saveID, _] of $saves.saves) {
			let items = JSON.parse(localStorage.getItem(saveID + '_items') as string);
			let set = new Set<string>(
				items.map(([key, val]: [string, string]) => val)
			);
			while (set.size > 8) {
				set.delete(set.values().next().value);
			}
			emojiFreqs.set(saveID, set);
		}
	});

	let showSaves = false;
	let showDiscover = false;

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	}

	async function addIsland() {
		let owner = await supabase.auth.getUser();
		if (!owner.data.user) {
			return;
		}

		// CF #8
		const { data, error } = await supabase.from('islands').insert([
			{
				data: {
					map: {
						items: Object.fromEntries($map.items),
						backgrounds: Object.fromEntries($map.backgrounds),
					},
					rbxs: Array.from($rbxStore),
					pushers: Object.fromEntries($pushers),
					mergers: Object.fromEntries($mergers),
					effectors: Object.fromEntries($effectors),
					interactables: Object.fromEntries($interactables),
					controllables: Object.fromEntries($controllables),
					dialogueTree: Object.fromEntries($dialogue),
				},
				owner: owner.data.user.id,
			},
		]);
	}

	async function getIslands() {
		let user = await supabase.auth.getUser();
		let { data: islands, error } = await supabase
			.from('islands')
			.select('data')
			.eq('owner', user.data.user?.id);
	}
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>

<main
	class="relative flex h-screen w-screen items-start justify-start gap-4 p-4"
>
	<!-- <div class="dropdown dropdown-bottom dropdown-end absolute right-4 top-4">
		<button class="avatar ">
			<div class="w-12 rounded-full ring ring-neutral-content">
				<img src="https://picsum.photos/200" alt="profile picture" />
			</div>
		</button>
		<ul
			tabindex="0"
			class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
		>
			<li><a href="/user/1">Profile</a></li>
			<li><a href="/account">Account</a></li>
			<li><a href="/">Logout</a></li>
		</ul>
	</div> -->
	<aside
		id="aside"
		class="aside z-10 flex h-full w-96 flex-col gap-2 overflow-y-auto bg-neutral bg-opacity-95 shadow-xl"
	>
		{#if showSaves}
			<div class="flex flex-row gap-2">
				<button class="btn w-fit" on:click={() => (showSaves = false)}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
						/>
					</svg>
				</button>
			</div>
			<Saves {emojiFreqs} />
		{:else}
			<button on:click={() => (showSaves = true)} class="btn-primary btn w-full"
				>PLAY</button
			>
			<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
			<button
				on:click={() => (showDiscover = !showDiscover)}
				class="btn-accent btn">DISCOVER</button
			>
		{/if}
	</aside>
	{#if showDiscover}
		<Discover />
	{/if}
	<div class="absolute bottom-2 right-2">Emojistan v0.0.1</div>
</main>
<Background />
