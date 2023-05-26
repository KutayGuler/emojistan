<script lang="ts">
	import { notifications } from '$src/routes/notifications';
	import type { PageData } from './$types';
	export let data: PageData;
	let openEdit = false;
	let updating = false;

	async function updateBio() {
		if (updating) return;
		updating = true;

		const {
			data: _data,
			error,
			...rest
		} = await data.supabase
			.from('profiles')
			// @ts-expect-error
			.update({ bio: data.profileData?.bio })
			.eq('id', data.profileData?.id);

		updating = false;
		openEdit = false;

		if (error) {
			notifications.warning('An error occured. Please try again later.');
		} else {
			notifications.success('Bio updated.');
		}
	}
</script>

{#if openEdit}
	<textarea
		class="textarea-bordered textarea mb-2 h-full bg-base-200 text-2xl text-neutral"
		name="bio"
		cols="30"
		rows="10"
		bind:value={data.profileData.bio}
	/>
	<form class="self-end" on:submit={updateBio}>
		<button
			type="submit"
			class="btn-primary btn-sm btn w-fit {updating ? 'loading' : ''}"
			>{updating ? 'UPDATING' : 'UPDATE'}</button
		>
	</form>
{:else}
	{#if data.profileData?.bio}
		<p class="h-full text-2xl">{data.profileData.bio}</p>
	{:else}
		<i
			class="twa twa-fountain-pen absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
		/>
	{/if}
	{#if data.isOwner}
		<button
			on:click={() => {
				openEdit = true;
			}}
			class="btn-ghost btn-sm btn w-fit self-end">Edit bio</button
		>
	{/if}
{/if}
