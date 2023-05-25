<script lang="ts">
	import supabase from '$api/supabase';
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
	} from '$src/store';
	import { rbxStore as rbxs } from '$lib/stores/store';
	import { page } from '$app/stores';
	import { notifications } from '$src/routes/notifications';

	let name: string;
	let description: string;

	async function publish() {
		const { data, error } = await supabase
			.from('games')
			.insert([{ name, description, user_id: $page.data.session?.user.id }]);

		if (error) {
			notifications.warning(
				'Failed to publish the game. Please try again later.'
			);
		} else {
			notifications.success(name + ' got published!');
		}
	}

	async function updateGame() {
		// const data = {
		// 	map: {
		// 		items: getObjFromStorage(saveID + '_items'),
		// 		backgrounds: getObjFromStorage(saveID + '_backgrounds'),
		// 		colors: getObjFromStorage(saveID + '_colors'),
		// 		dbg: localStorage.getItem(saveID + '_dbg'),
		// 		ssi: localStorage.getItem(saveID + '_ssi'),
		// 	},
		// 	rbxs: Array.from(
		// 		JSON.parse(localStorage.getItem(saveID + '_rbxs') as string)
		// 	),
		// 	pushers: getObjFromStorage(saveID + '_pushers'),
		// 	mergers: getObjFromStorage(saveID + '_mergers'),
		// 	effectors: getObjFromStorage(saveID + '_effectors'),
		// 	interactables: getObjFromStorage(saveID + '_interactables'),
		// 	controllables: getObjFromStorage(saveID + '_controllables'),
		// 	sequencers: getObjFromStorage(saveID + '_sequencers'),
		// 	dt: getObjFromStorage(saveID + '_dt'),
		// };

		let gameData = {
			map: $map,
			rbxs: $rbxs,
			pushers: $pushers,
			mergers: $mergers,
			effectors: $effectors,
			interactables: $interactables,
			controllables: $controllables,
			sequencers: $sequencers,
		};

		// TODO: corresponding game id it should also be saved on localStorage
		// const { data: _data, error } = await supabase
		// 	.from('games')
		// 	.update({ data: gameData })
		// 	.eq('user_id', $page.data.session?.user.id);
	}

	function unpublish() {
		modal.show({
			content:
				'If you unpublish your game, it will be <span class="text-error">deleted from our servers<span/> and will not be visible to other players. <span class="text-success">Saves on your local device will be intact.<span/>',
			header: 'Unpublish Game',
			confirmText: 'UNPUBLISH',
			// @ts-expect-error
			onConfirm: async () => {
				let correspondingID = 0; // TODO: corresponding id in datbase

				const { data, error } = await supabase
					.from('games')
					.delete()
					.eq('id', correspondingID);
			},
			input: false,
			danger: true,
		});
	}
</script>

<main>
	<div
		class="flex h-[624px] w-[972px] flex-col items-start gap-2 overflow-y-auto px-4 2xl:h-[720px] 2xl:w-[1068px]"
	>
		{#if $page.data.session}
			<h1>Publish</h1>
			<form on:submit|preventDefault={publish} />
			<button
				on:click={unpublish}
				class="btn-ghost btn border-none hover:border-none hover:bg-error hover:text-error-content"
				>Unpublish</button
			>
		{:else}
			<p>Go back to main menu and login to publish your game.</p>
		{/if}
	</div>
</main>
