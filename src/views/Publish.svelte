<script lang="ts">
	import {
		modal,
		map,
		pushers,
		mergers,
		effectors,
		interactables,
		controllables,
		sequencers,
		dialogueTree as dt,
		saves,
	} from '$src/store';
	import { rbxStore as rbxs } from '$lib/stores/store';
	import { page } from '$app/stores';
	import { notifications } from '$src/routes/notifications';
	import { onMount, type ComponentProps } from 'svelte';
	import type Game from './Game.svelte';

	let description: string;
	let isPublished = false;
	let gameData: any;
	let publishes: any;
	let descriptions: any;

	let resolved = true;

	onMount(() => {
		publishes = JSON.parse(localStorage.getItem('publishes') as string);
		descriptions = JSON.parse(localStorage.getItem('descriptions') as string);
		publishes = new Map(publishes || []);
		descriptions = new Map(descriptions || []);
		if (publishes.has($saves.currentSaveID)) {
			isPublished = true;
		}

		description = descriptions.get($saves.currentSaveID) || '';

		gameData = {
			map: {
				items: Array.from($map.items),
				backgrounds: Array.from($map.backgrounds),
				colors: Array.from($map.colors),
				dbg: $map.dbg,
				ssi: $map.ssi,
			},
			rbxs: $rbxs,
			pushers: Array.from($pushers),
			mergers: Array.from($mergers),
			effectors: Array.from($effectors),
			interactables: Array.from($interactables),
			controllables: Array.from($controllables),
			sequencers: Array.from($sequencers),
			dt: Array.from($dt),
		};
	});

	async function publish() {
		if (!map.hasControllable()) {
			notifications.warning('No controllable found in the starting section.');
			return;
		}

		// TODO if status code is 409, user has to create a profile first

		resolved = false;

		const uuid = crypto.randomUUID();
		const { error } = await $page.data.supabase.from('games').insert({
			id: uuid,
			data: gameData,
			name: $saves.currentSaveName,
			description,
			user_id: $page.data.session?.user.id,
		});

		resolved = true;

		if (error) {
			notifications.warning('Failed to publish the game. Try again later.');
			return;
		}

		publishes.set($saves.currentSaveID, uuid);
		descriptions.set($saves.currentSaveID, description);
		localStorage.setItem('publishes', JSON.stringify(Array.from(publishes)));
		localStorage.setItem('descriptions', JSON.stringify(Array.from(descriptions)));
		notifications.success($saves.currentSaveName + ' got published!');
		isPublished = true;
	}

	async function updateGame() {
		if (!map.hasControllable()) {
			notifications.warning('No controllable found in the starting section.');
			return;
		}

		resolved = false;

		const { data, error } = await $page.data.supabase
			.from('games')
			.update({ name: $saves.currentSaveName, description, data: gameData })
			.eq('id', publishes.get($saves.currentSaveID));

		resolved = true;

		if (error) {
			notifications.warning('Failed to update the game. Try again later.');
			return;
		}

		descriptions.set($saves.currentSaveID, description);
		localStorage.setItem(
			'descriptions',
			JSON.stringify(Array.from(descriptions))
		);
		notifications.success('Game updated successfully.');
	}

	function unpublish() {
		modal.show({
			content:
				'If you unpublish your game, it will be <span class="text-error">deleted from our servers<span/> and will not be visible to other players. <span class="text-success">Saves on your local device will be intact.<span/>',
			header: 'Unpublish Game',
			confirmText: 'UNPUBLISH',
			// @ts-expect-error
			onConfirm: async () => {
				const { error } = await $page.data.supabase
					.from('games')
					.delete()
					.eq('id', publishes.get($saves.currentSaveID));

				if (error) {
					notifications.warning(
						'Failed to unpublish the game. Try again later.'
					);
					return;
				}

				notifications.success('Game successfully got unpublished.');
				isPublished = false;
				publishes.delete($saves.currentSaveID);
				localStorage.setItem(
					'publishes',
					JSON.stringify(Array.from(publishes))
				);
			},
			input: false,
			danger: true,
		});
	}

	function download() {
		const data: ComponentProps<Game> = {
			map: $map,
			// @ts-expect-error
			rbxs: $rbxs,
			pushers: $pushers,
			mergers: $mergers,
			effectors: $effectors,
			interactables: $interactables,
			controllables: $controllables,
			sequencers: $sequencers,
			dt: $dt,
		};

		let dataStr =
			'data:text/json;charset=utf-8,' +
			encodeURIComponent(JSON.stringify(data));
		let downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute(
			'download',
			'emojistan-' + $saves.currentSaveID + '.json'
		);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
</script>

<main>
	<div
		class="flex h-[624px] w-[972px] flex-col items-start gap-2 overflow-y-auto px-4 2xl:h-[720px] 2xl:w-[1068px]"
	>
		{#if $page.data.session}
			{@const fn = isPublished ? updateGame : publish}
			{@const text = isPublished ? 'UPDATE' : 'PUBLISH'}

			<div class="flex h-full w-full flex-col">
				<label class="p-1" for="name">Name</label>
				<input
					type="text"
					class="input-bordered input"
					bind:value={$saves.currentSaveName}
				/>
				<label class="p-1 pt-4" for="description">Description</label>
				<textarea
					class="textarea-bordered textarea h-full"
					bind:value={description}
				/>
				<div class="flex-grow" />
				<div class="flex w-full flex-row gap-2 self-end pt-4">
					<button on:click={download} class="btn">DOWNLOAD SAVE FILE</button>
					<div class="flex-grow" />
					{#if isPublished}
						<button
							on:click={unpublish}
							class="btn-ghost btn border-none hover:border-none hover:bg-error hover:text-error-content"
							>Unpublish</button
						>
						<a href="/games/{publishes.get($saves.currentSaveID)}" class="btn"
							>GO TO GAME LINK</a
						>
					{/if}
					<button on:click={fn} class="btn {resolved ? '' : 'loading'}"
						>{text}</button
					>
				</div>
			</div>
		{:else}
			<p>Go back to main menu and login to publish your game.</p>
		{/if}
	</div>
</main>
