<script lang="ts">
	import supabase from '$api/supabase';
	import type { PageData } from './$types';
	import { notifications } from '$src/routes/notifications';
	import { page } from '$app/stores';
	export let data: PageData;

	let username = '';
	let usernameSet = false;

	const tabs = [
		'About',
		'Games',
		'Favorites',
		'Followers',
		'Following',
	] as const;

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
		<!-- TODO: profile could not be found image -->
		<h2 />
	{/if}
{:else}
	<div class="flex h-full flex-col gap-4">
		<div class="flex flex-row items-end gap-4">
			<div class="placeholder avatar">
				<div class="w-16 rounded-full bg-neutral text-neutral-content">
					<i class="twa twa-alien text-4xl" />
				</div>
			</div>
			<h1 class="text-6xl">{data.username}</h1>
		</div>
		<div class="tabs tabs-boxed z-10 w-full">
			{#each tabs as tab}
				{@const href = tab == 'About' ? '' : tab.toLowerCase()}
				{@const selected =
					(href != '' && $page.route.id?.includes(href)) ||
					(href == '' && $page.route.id?.split('/').length == 3)}
				<a
					href="/profile/{$page.params.username}/{href}"
					class="tab {selected ? 'brutal tab-active' : ''}">{tab} 25</a
				>
			{/each}
		</div>
		<div
			class="brutal flex h-full w-full flex-col rounded bg-neutral p-4 text-neutral-content"
		>
			<slot />
		</div>
	</div>
{/if}
