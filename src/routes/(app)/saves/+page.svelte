<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { saves } from '$src/store';
	import { fly } from 'svelte/transition';
	import { notifications } from '$src/routes/notifications';

	let emojiFreqs = new Map<string, Set<string>>();

	onMount(() => {
		if ($saves.currentSaveID === '') saves.useStorage();
		for (let [saveID, _] of $saves.saves) {
			let items = JSON.parse(localStorage.getItem(saveID + '_items') as string);
			let set = new Set<string>(
				items?.map(([key, val]: [string, string]) => val)
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

	function getObjFromStorage(key: string) {
		return Object.fromEntries(JSON.parse(localStorage.getItem(key) as string));
	}

	function downloadSave(saveID: string) {
		const data = {
			map: {
				items: getObjFromStorage(saveID + '_items'),
				backgrounds: getObjFromStorage(saveID + '_backgrounds'),
				colors: getObjFromStorage(saveID + '_colors'),
				dbg: localStorage.getItem(saveID + '_dbg'),
				ssi: localStorage.getItem(saveID + '_ssi'),
			},
			rbxs: Array.from(
				JSON.parse(localStorage.getItem(saveID + '_rbxs') as string)
			),
			pushers: getObjFromStorage(saveID + '_pushers'),
			mergers: getObjFromStorage(saveID + '_mergers'),
			effectors: getObjFromStorage(saveID + '_effectors'),
			interactables: getObjFromStorage(saveID + '_interactables'),
			controllables: getObjFromStorage(saveID + '_controllables'),
			sequencers: getObjFromStorage(saveID + '_sequencers'),
			dt: getObjFromStorage(saveID + '_dt'),
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

	let fileElement: HTMLInputElement;
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

<div class="flex h-full flex-col gap-4">
	<div class="flex w-full gap-2 px-0 md:px-4">
		<input
			class="file-input-bordered file-input"
			type="file"
			id="save-file"
			accept="application/json"
			required
			bind:files
			bind:this={fileElement}
			on:change={() => {
				if (files[0].type != 'application/json') {
					fileElement.value = '';
					// @ts-expect-error
					files = false;
					notifications.danger(
						'Wrong file type. Save files should be in JSON format.'
					);
				}
			}}
		/>
		{#if files}
			<button class="btn" on:click={openUploadedSave}>OPEN</button>
		{/if}
		<button
			in:fly={{ x: 200 }}
			on:click={createNewGame}
			class="btn-primary btn h-10 flex-grow text-lg md:h-28 md:text-4xl"
			>NEW GAME</button
		>
	</div>
	<div class="h-full overflow-y-auto overflow-x-hidden px-0 md:px-4">
		{#each [...$saves.saves] as [id, name], i}
			<div
				in:fly={{ delay: (i + 1) * 80, x: 200 }}
				class="brutal relative mb-2 flex h-28 flex-col rounded-lg bg-slate-300 p-2 md:h-56 md:p-4"
			>
				{#if renameIndex === i}
					<form
						class="pb-4"
						on:submit={() => {
							saves.rename(id, newName);
							renameIndex = -1;
						}}
					>
						<!-- svelte-ignore a11y-autofocus -->
						<input
							autofocus
							class="input-bordered input input-sm"
							type="text"
							bind:value={newName}
						/>
						<button type="submit"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-3 w-3 md:h-6 md:w-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M4.5 12.75l6 6 9-13.5"
								/>
							</svg>
						</button>
					</form>
				{:else}
					<div class="flex gap-2 pb-4">
						<h3>{name}</h3>
						<button
							on:click={() => {
								newName = name;
								renameIndex = i;
							}}
							class="w-fit pl-0 text-slate-500"
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
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
								/>
							</svg>
						</button>
					</div>
				{/if}
				<p>
					{#each [...(emojiFreqs.get(id) || [])] as e}
						<i class="twa text-4xl twa-{e}" />
					{/each}
				</p>
				<div class="flex flex-grow" />
				<div class="flex w-full flex-row items-end gap-2 self-end">
					<button
						title="Download save file"
						class="btn-ghost btn-sm btn"
						on:click={() => downloadSave(id)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-4 w-4 md:h-6 md:w-6"
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
							<button class="btn-error btn-xs btn md:btn-sm">CONFIRM</button>
						</form>
						<button
							class="btn-xs btn md:btn-sm"
							on:click={() => {
								deleteIndex = -1;
							}}>CANCEL</button
						>
					{:else}
						<button
							on:click={() => {
								deleteIndex = i;
							}}
							class="btn-ghost btn-xs btn border-none md:btn-sm hover:border-none hover:bg-error"
							>DELETE</button
						>
					{/if}
					<button on:click={() => openSave(id)} class="btn-xs btn md:btn-sm"
						>OPEN</button
					>
				</div>
			</div>
		{/each}
	</div>
</div>
