<script lang="ts">
	import supabase from '$api/supabase';
	import type { PageData } from './$types';
	import { notifications } from '$src/routes/notifications';
	import Games from './Games.svelte';
	import Followers from './Followers.svelte';
	import Following from './Following.svelte';
	import Favorites from './Favorites.svelte';

	export let data: PageData;

	let username = '';
	let usernameSet = false;

	type Tab = 'Followers' | 'Following' | 'Games' | 'Favorites' | '';

	let currentTab: Tab = 'Games';

	async function setUsername() {
		let { data: usernames, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('username', username);

		if (usernames == null || usernames.length == 0) {
			const { data: res, error } = await supabase
				.from('profiles')
				.insert({ id: data.session?.user.id, username });

			if (error) {
				notifications.warning(error.message);
				return;
			}

			usernameSet = true;
			notifications.success(`Username set to ${username}. Reloading page.`);
			setTimeout(() => {
				location.reload();
			}, 1000);
		} else {
			notifications.warning('This username is already taken.');
		}

		console.log(usernames);
	}

	const tabs: Array<Tab> = ['Games', 'Favorites', 'Followers', 'Following'];
</script>

{#if data.profileNotCreated}
	{#if data.isOwner}
		<h2>
			You don't have a username. Enter a username to make your profile public.
		</h2>
		{#if !usernameSet}
			<form on:submit|preventDefault={setUsername}>
				<input
					required
					type="text"
					class="input-bordered input mt-4"
					bind:value={username}
				/>
				<button type="submit" class="btn-primary btn">ENTER</button>
			</form>
		{/if}
	{:else}
		<h2>This user has not created a profile yet.</h2>
	{/if}
{:else}
	<div class="flex h-full flex-col gap-4">
		<div class="flex flex-row items-end gap-4">
			<div class="avatar">
				<div class="w-16 rounded-full">
					<img src="https://picsum.photos/200" />
				</div>
			</div>
			<h1 class="text-6xl">{data.username}</h1>
		</div>
		<div class="tabs tabs-boxed z-10 w-full">
			{#each tabs as tab}
				<button
					on:click={() => {
						currentTab = currentTab == tab ? '' : tab;
					}}
					class:tab-active={currentTab == tab}
					class="tab">{tab} 25</button
				>
			{/each}
		</div>
		<div
			class="brutal flex h-full w-full flex-col rounded bg-neutral p-4 text-neutral-content"
		>
			{#if currentTab === 'Games'}
				<Games />
			{:else if currentTab === 'Favorites'}
				<Favorites></Favorites>
			{:else if currentTab === 'Followers'}
				<Followers />
			{:else if currentTab === 'Following'}
				<Following />
			{/if}
		</div>
	</div>
{/if}
