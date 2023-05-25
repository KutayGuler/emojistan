<script lang="ts">
	import supabase from '$api/supabase';
	import type { PageData } from './$types';
	import { notifications } from '$src/routes/notifications';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let data: PageData;

	let username = '';
	let usernameSet = false;

	$: tabs = [
		{ title: 'Games', count: data?.games?.count || 0 },
		{ title: 'Likes', count: data?.likes?.count || 0 },
		{ title: 'Followers', count: data?.follower?.count || 0 },
		{ title: 'Following', count: data?.following?.count || 0 },
	];

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
				goto('/profile/' + username, { replaceState: true });
			}, 1000);
		} else {
			notifications.warning('This username is already taken.');
		}
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
		<div class="flex h-full w-full flex-col items-center justify-center gap-12">
			<i class="twa twa-face-in-clouds scale-150 text-9xl" />
			<h2>{$page.params.username} is not here</h2>
		</div>
	{/if}
{:else}
	<div class="flex h-full flex-col gap-4">
		<div class="flex flex-row items-end gap-4">
			<div class="placeholder avatar">
				<div class="w-16 rounded-full bg-neutral text-neutral-content">
					<i class="twa twa-alien text-4xl" />
				</div>
			</div>
			<h1 class="text-6xl">{$page.params.username}</h1>
		</div>
		<div class="tabs tabs-boxed z-10 w-full">
			<a
				href="/profile/{$page.params.username}"
				class="tab {$page.route.id?.at(-1) == ']' ? 'brutal tab-active' : ''}"
				>Bio</a
			>
			{#each tabs as { title, count }}
				{@const href = title.toLowerCase()}
				{@const selected = href != '' && $page.route.id?.includes(href)}
				<a
					href="/profile/{$page.params.username}/{href}"
					class="tab {selected ? 'brutal tab-active' : ''}"
				>
					{title}
					{count}
				</a>
			{/each}
		</div>
		<div
			class="brutal flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded bg-neutral p-4 text-neutral-content"
		>
			<slot />
		</div>
	</div>
{/if}
