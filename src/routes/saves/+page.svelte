<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		saves,
		map,
		pushers,
		mergers,
		interactables,
		effectors,
		dialogueTree as dialogue,
	} from '$src/store';
	import { rbxStore } from '$lib/stores/store';
	import { fly, scale } from 'svelte/transition';

	let emojiFreqs = new Map<string, Set<string>>();

		// TODO: save in store
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
			effectors: Object.fromEntries($effectors),
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

		const id = $saves.currentSaveID;

		for (let key of Object.keys(obj)) {
			if (key === 'map') {
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
		if (e.code === 'Escape') {
			renameIndex = -1;
			deleteIndex = -1;
		}
	}}
/>

<!-- <div class="flex flex-row gap-2">
	<input class="file-input" type="file" name="save-file" bind:files />
	{#if files}
	<button class="btn" on:click={openUploadedSave}>OPEN</button>
	{/if}
</div> -->

<h1 class="text-6xl">Play</h1>
<button
	in:fly={{ x: 200 }}
	on:click={createNewGame}
	class="btn-primary btn mt-4 h-48 w-full text-4xl">NEW GAME</button
>
<div class="flex-grow overflow-y-auto overflow-x-hidden">
	{#each [...$saves.saves] as [id, name], i}
		<div
			in:fly={{ delay: (i + 1) * 80, x: 200 }}
			class="brutal relative mb-2 flex h-48 flex-col rounded-lg bg-slate-300 p-4"
		>
			{#if renameIndex === i}
				<form
					on:submit={() => {
						saves.rename(id, newName);
						renameIndex = -1;
					}}
				>
					<!-- svelte-ignore a11y-autofocus -->
					<input
						autofocus
						class="input-bordered input"
						type="text"
						bind:value={newName}
					/>
				</form>
			{:else}
				<h3>{name}</h3>
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
					<i class="twa text-4xl twa-{e}" />
				{/each}
			</p>
			<div class="flex flex-grow" />
			<div class="flex w-full flex-row items-end gap-2 self-end">
				<button class="btn-ghost btn-sm btn" on:click={() => downloadSave(id)}>
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
				{#if deleteIndex === i}
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
						class="btn-ghost btn-sm btn border-none hover:bg-error"
						>DELETE</button
					>
				{/if}
				<button on:click={() => openSave(id)} class="btn-sm btn">OPEN</button>
			</div>
		</div>
	{/each}
</div>
