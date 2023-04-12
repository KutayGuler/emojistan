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
		dialogueTree as dialogue,
		modal,
	} from '../store';
	import { rbxStore } from '$lib/stores/store';
	import { generateID } from './utils';
	import { EditableMap } from '$src/types';
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

	function shuffleArray(array: Array<string>) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	let renameIndex = -1;
	let newName = '';
	let deleteIndex = -1;
	let files: FileList;

	function downloadSave(saveID: string) {
		const data = {
			map: {
				items: Object.fromEntries($map.items),
				backgrounds: Object.fromEntries($map.backgrounds),
				colors: Object.fromEntries($map.colors),
				dbg: $map.dbg,
			},
			rbxs: Array.from($rbxStore),
			pushers: Object.fromEntries($pushers),
			mergers: Object.fromEntries($mergers),
			equippables: Object.fromEntries($equippables),
			consumables: Object.fromEntries($consumables),
			interactables: Object.fromEntries($interactables),
			dialogue: Object.fromEntries($dialogue),
		};

		let dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(data));
		let downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute(
			'download',
			'emojistan-' + saveID + '.json'
		);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

	async function openUploadedSave() {
		let content = await files[0].text();
		let obj = JSON.parse(content);
		saves.add(
			'Upload-' +
				new Intl.DateTimeFormat('en-GB', {
					dateStyle: 'full',
					timeStyle: 'short',
				}).format(new Date())
		);

		console.log(obj.rbxs);

		const id = $saves.currentSaveID;

		for (let key of Object.keys(obj)) {
			if (key == 'map') {
				for (let _key of Object.keys(obj.map)) {
					if (_key === 'dbg') {
						localStorage.setItem(id + '_dbg', obj.map.dbg);
					} else {
						localStorage.setItem(
							id + '_' + _key,
							JSON.stringify(Object.entries(obj.map[_key]))
						);
					}
				}
			} else if (key === 'rbxs') {
				localStorage.setItem(
					id + '_' + key,
					JSON.stringify(Array.from(obj[key]))
				);
			} else {
				localStorage.setItem(
					id + '_' + key,
					JSON.stringify(Object.entries(obj[key]))
				);
			}
		}

		goto('/editor');
	}
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape') {
			renameIndex = -1;
			deleteIndex = -1;
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
			<div class="flex flex-row gap-2">
				<input class="file-input " type="file" name="save-file" bind:files />
				{#if files}
					<button class="btn" on:click={openUploadedSave}>OPEN</button>
				{/if}
			</div>
			<!-- <div class="w-full rounded-lg border-2"> -->
			<!-- <button class="btn w-full rounded-lg shadow-inner" on:click={() => {}}>
					UPLOAD SAVE FILE &nbsp;
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
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
				</button> -->
			<!-- </div> -->
			{#each [...$saves.saves] as [id, name], i}
				<div class="relative flex flex-col rounded-lg bg-slate-300 p-4">
					{#if renameIndex == i}
						<form
							on:submit={() => {
								saves.rename(id, newName);
								renameIndex = -1;
							}}
						>
							<!-- svelte-ignore a11y-autofocus -->
							<input
								autofocus
								class="input-bordered input "
								type="text"
								bind:value={newName}
							/>
						</form>
					{:else}
						<h4>{name}</h4>
						{#if !renameIndex}
							<button
								on:click={() => {
									newName = name;
									renameIndex = i;
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
					<div class="flex w-full flex-row items-end gap-2 self-end pt-12">
						<button
							class="btn-ghost btn-sm btn"
							on:click={() => downloadSave(id)}
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
									d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
								/>
							</svg>
						</button>
						<div class="flex flex-grow" />
						{#if deleteIndex == i}
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
									deleteIndex = -1;
								}}>CANCEL</button
							>
						{:else}
							<button
								on:click={() => {
									deleteIndex = i;
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
