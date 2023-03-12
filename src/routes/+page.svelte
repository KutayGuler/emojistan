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
	import { navigating } from '$app/stores';
	import { rbxStore } from '$lib/stores/store';
	import { emojis } from './editor/emojis';
	import { fly } from 'svelte/transition';
	import { CROSS } from '$src/constants';

	onMount(() => {
		if ($saves.currentSaveID == '') saves.useStorage();
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
	let deletedGameName = '';
	let deletedGameID = '';
	let creating = false;
	let showModal = false;

	function newGame() {
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

<!-- Put this part before </body> tag -->
<!-- <input
	type="checkbox"
	id="new-game"
	class="modal-toggle"
	bind:checked={showModal}
/>
<label for="new-game" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">What's the name of the game?</h3>
		<span class="inline">
			<input
				type="text"
				class="input-bordered input my-4"
				bind:value={gameName}
			/>
			<button class="btn" disabled={gameName.length < 3} on:click={newGame}
				>CREATE</button
			>
		</span>
	</label>
</label> -->

<!-- Put this part before </body> tag -->
<!-- <input type="checkbox" id="delete-save" class="modal-toggle" /> -->
<!-- <label for="delete-save" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<p class="text-2xl font-bold">
			Are you sure you want to delete {deletedGameName}?
		</p>

		<div class="modal-action">
			<label for="delete-save" class="btn">Cancel</label>
			<label
				for="delete-save"
				class="btn-error btn"
				on:click={() => {
					saves.delete(deletedGameID)
					location.reload() // REQUIRED FOR DELETING SAVES PROPERLY
				}}>Delete</label
			>
		</div>
	</label>
</label> -->

<!-- <div class="drawer-mobile drawer">
	<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col items-start justify-start">
		{#if !$navigating}
			<h1 class="pt-4 text-2xl">Saves</h1>
			{#if $saves.loaded}
				<div class="flex w-1/3 flex-col gap-2 py-8 ">
					{#each [...$saves.saves] as [id, title]}
						<div class="relative text-lg shadow-lg">
							<button
								class="my-0 flex h-20 w-full flex-row items-center justify-start rounded-md border-r-2 p-4 duration-200 ease-out hover:bg-secondary hover:text-white"
								on:click={() => openSave(id)}
							>
								<div>{title}</div>
							</button>

							<label
								on:click={() => {
									deletedGameID = id
									deletedGameName = title
								}}
								for="delete-save"
								class="absolute top-2 right-2 cursor-pointer"
							>
								<svg
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
										d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
									/>
								</svg></label
							>
						</div>
					{:else}
						<p>You do not have any saved games.</p>
					{/each}
				</div>
			{:else}
				<p>Loading...</p>
			{/if}
		{/if}
		<label for="my-drawer-2" class="btn-primary drawer-button btn lg:hidden"
			>Open drawer</label
		>
	</div>
	<div class="drawer-side">
		<label for="my-drawer-2" class="drawer-overlay" />

		<ul class="menu m-4 w-80 rounded bg-base-200 text-base-content">
			<p class="select-none p-4 text-2xl">Emojistan 🏝️</p>
			<div class="mx-4 mt-2 box-border ">
				<button class="btn w-full" on:click={() => goto('/tutorial/controls')}
					>TUTORIAL</button
				>
			</div>
			<div class="mx-4 mt-2 box-border ">
				<label for="new-game" class="btn w-full">NEW GAME</label>
			</div>
		</ul>
	</div>
</div> -->

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
		<!-- <label tabindex="0" class="btn m-1">Click</label> -->
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
				<button class="btn-primary btn flex-grow">NEW GAME</button>
			</div>
			{#each [...$saves.saves] as [id, name]}
				<div class="brutal relative flex flex-col rounded bg-primary p-4 pt-0">
					<button
						on:click={() =>
							modal.show('Deleting ' + name, 'Are you sure?', 'DELETE', () => {
								saves.delete(deletedGameID);
								location.reload(); // REQUIRED FOR DELETING SAVES PROPERLY
							})}
						class="absolute top-2 right-4">{CROSS}</button
					>
					<h4>{name}</h4>
					<p>date</p>
					<button on:click={() => openSave(id)} class="btn-sm btn self-end"
						>OPEN</button
					>
				</div>
			{/each}
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
