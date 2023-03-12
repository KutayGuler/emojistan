<script lang="ts">
	import supabase from '../supabase';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		saves,
		map,
		pushers,
		mergers,
		interactables,
		equippables,
		consumables,
		dialogueTree,
		modal,
	} from '../store';
	import { rbxStore } from '$lib/stores/store';
	import { emojis } from './editor/emojis';
	import { CROSS } from '$src/constants';

	let emojiFreqs = new Map<string, Set<string>>();

	onMount(() => {
		if ($saves.currentSaveID == '') saves.useStorage();
		for (let [saveID, _] of $saves.saves) {
			let items = JSON.parse(localStorage.getItem(saveID + '_items') as string);
			emojiFreqs.set(
				saveID,
				new Set(items.map(([key, val]: [string, string]) => val))
			);
			console.log(emojiFreqs);
		}
	});

	let emojiArray: string[] = [];
	let emojiString = '';

	for (let [key, val] of Object.entries(emojis)) {
		for (let [emoji, _] of val) {
			emojiArray.push(emoji);
		}
	}

	emojiString = shuffleArray(emojiArray).toString().replaceAll(',', '');

	let showSaves = true;

	let gameName = '';
	let creating = false;
	let showModal = false;

	function newGamePopup() {
		// modal.show();
		// TODO:
	}

	function createNewGame() {
		if (creating) return;
		showModal = false;
		saves.add(gameName);
		goto('/editor');
		creating = true;
	}

	function openSave(id: string) {
		$saves.currentSaveID = id;
		goto('/editor');
	}

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
					equippables: Object.fromEntries($equippables),
					consumables: Object.fromEntries($consumables),
					interactables: Object.fromEntries($interactables),
					dialogueTree: Object.fromEntries($dialogueTree),
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

	function shuffleArray(array: Array<string>) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>

<main>
	<div
		class="absolute top-0 flex h-full w-full -rotate-6 skew-x-6 scale-125 select-none flex-wrap text-2xl text-opacity-10 2xl:text-4xl"
	>
		{emojiString}
	</div>
	<div class="absolute top-0 h-full w-full bg-black opacity-75" />
	<div class="dropdown-bottom dropdown-end dropdown absolute right-4 top-4">
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
	</div>
	<div
		class="aside prose mt-16 flex h-[806px] w-96 flex-col gap-2 overflow-y-auto bg-neutral"
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
				<button on:click={createNewGame} class="btn-primary btn flex-grow"
					>NEW GAME</button
				>
			</div>
			{#each [...$saves.saves] as [id, name]}
				<div
					class="brutal relative flex flex-col rounded bg-slate-300 p-4 pt-0"
				>
					<button
						on:click={() =>
							modal.show('Deleting ' + name, 'Are you sure?', 'DELETE', () => {
								saves.delete(id);
								// location.reload(); // REQUIRED FOR DELETING SAVES PROPERLY
							})}
						class="absolute top-2 right-4">{CROSS}</button
					>
					<h4>{name}</h4>
					<p>
						{#each [...emojiFreqs.get(id)] as e}{e}{/each}
					</p>
					<button on:click={() => openSave(id)} class="btn-sm btn self-end"
						>OPEN</button
					>
				</div>
			{/each}
			<!-- TODO: Add example projects -->
			<div class="divider text-neutral-content">EXAMPLE PROJECTS</div>
		{:else}
			<h1 class="text-neutral-content">Emojistan</h1>
			<button on:click={() => (showSaves = true)} class="btn-primary btn w-full"
				>PLAY</button
			>
			<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
			<a href="/discover" class="btn-accent btn">DISCOVER</a>
			<button class="btn w-full">OPTIONS</button>
		{/if}
	</div>
</main>

<style>
	.saved {
		opacity: 100%;
	}

	.current {
		opacity: 100%;
		transform: scale(150%);
	}

	main {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: start;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}

	#emoji-background {
		background-color: #dfdbe5;
		background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
	}
</style>
