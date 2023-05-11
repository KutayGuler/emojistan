<script lang="ts">
	import supabase from '$api/supabase';
	import type { PageData } from './$types';
	import { notifications } from '$src/routes/notifications';

	export let data: PageData;

	let username = '';
	let usernameSet = false;

	async function setUsername() {
		let { data: usernames, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('username', username);

		if (usernames == null || usernames.length == 0) {
			console.log(data.session.user.id, username);

			const { data: res, error } = await supabase
				.from('profiles')
				.insert({ id: data.session.user.id, username });

			if (res) {
				usernameSet = true;
				notifications.success(`Username set to ${username}.`);
			} else if (error) {
				notifications.warning(error.message);
			}
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
		<h2>This user has not created a profile yet.</h2>
	{/if}
{:else}
	<div class="flex flex-row items-center gap-2">
		<div class="avatar">
			<div class="w-12 rounded-full">
				<img src="https://picsum.photos/200" />
			</div>
		</div>
		
		<h1 class="text-6xl">{data.username}</h1>
		<div class="tabs tabs-boxed pt-4">
			<button class="tab" on:click={() => {}}
				><span class="text-base-content">36</span>&nbsp; Followers</button
			>
			<button class="tab" on:click={() => {}}
				><span class="text-base-content">36</span>&nbsp; Following</button
			>
		</div>
	</div>

	<div class="brutal my-8 h-48 w-full rounded p-4">bio</div>

	<div class="flex w-full flex-row gap-2">
		<div class="w-full overflow-y-auto">
			<h2>Games <i class="twa twa-joystick" /></h2>
		</div>
		<div class="w-full overflow-y-auto">
			<h2>Favorites <i class="twa twa-red-heart" /></h2>
		</div>
	</div>
{/if}
asdsasd