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
	import { CROSS } from '$src/constants';

	let emojiFreqs = new Map<string, Set<string>>();

	onMount(() => {
		if ($saves.currentSaveID == '') saves.useStorage();
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

	let showSaves = true;

	function createNewGame() {
		saves.add(
			new Intl.DateTimeFormat('en-GB', {
				dateStyle: 'full',
				timeStyle: 'short',
			}).format(new Date())
		);
		goto('/editor');
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

	let showRename = false;
	let newName = '';
	let confirmDelete = false;
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape') {
			showRename = false;
			confirmDelete = false;
		}
	}}
/>

<main>
	<div id="emojis" class="absolute top-0 h-full w-full" />
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
	<div
		class="aside mt-16 flex h-[806px] w-96 flex-col gap-2 overflow-y-auto bg-neutral shadow-xl"
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
			<button on:click={createNewGame} class="btn-primary btn">NEW GAME</button>
			{#each [...$saves.saves] as [id, name]}
				<div class="brutal relative flex flex-col rounded bg-slate-300 p-4">
					{#if showRename}
						<form
							on:submit={() => {
								saves.rename(id, newName);
								showRename = false;
							}}
						>
							<input
								autofocus
								class="input-bordered input "
								type="text"
								bind:value={newName}
							/>
						</form>
					{:else}
						<h4>{name}</h4>
						{#if !showRename}
							<button
								on:click={() => {
									newName = name;
									showRename = true;
								}}
								class="w-fit pl-0 text-slate-500">RENAME</button
							>
						{/if}
					{/if}
					<p>
						{#each [...(emojiFreqs.get(id) || [])] as e}
							<i class="twa twa-{e}" />
						{/each}
					</p>
					<div class="flex w-fit flex-row items-end gap-2 self-end pt-12">
						{#if confirmDelete}
							<form
								on:submit={() => {
									saves.delete(id);
									location.reload();
								}}
							>
								<button class="btn-error btn-sm btn">CONFIRM</button>
							</form>
							<button
								class="btn-sm btn"
								on:click={() => {
									confirmDelete = false;
								}}>CANCEL</button
							>
						{:else}
							<button
								on:click={() => {
									confirmDelete = true;
								}}
								class="btn-ghost btn-sm btn">DELETE</button
							>
						{/if}
						<button on:click={() => openSave(id)} class="btn-sm btn"
							>OPEN</button
						>
					</div>
				</div>
			{/each}
		{:else}
			<h1 class="text-neutral-content">Emojistan</h1>
			<button on:click={() => (showSaves = true)} class="btn-primary btn w-full"
				>PLAY</button
			>
			<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
			<!-- <a href="/discover" class="btn-accent btn">DISCOVER</a>
			<button class="btn w-full">OPTIONS</button> -->
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

	#emojis {
		background-image: url('emojis.png');
		background-size: cover;
	}
</style>
