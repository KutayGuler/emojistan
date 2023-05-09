<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);

	let show: 'followers' | 'following' | '' = '';
</script>

<div class="flex flex-row items-center gap-2">
	<div class="avatar">
		<div class="w-12 rounded-full">
			<img src="https://picsum.photos/200" />
		</div>
	</div>
	<h1 class="text-6xl">{data.session ? 'Username' : ''}</h1>
	<div class="tabs tabs-boxed pt-4">
		<button
			class="tab"
			on:click={() => {
				show = show == 'followers' ? '' : 'followers';
			}}><span class="text-base-content">36</span>&nbsp; Followers</button
		>
		<button
			class="tab"
			on:click={() => {
				show = show == 'following' ? '' : 'following';
			}}><span class="text-base-content">36</span>&nbsp; Following</button
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
