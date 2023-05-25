<script lang="ts">
	import supabase from '$api/supabase';
	import { modal } from '$src/store';

	// TODO
	let name: string;
	let description: string;

	function publish() {
		// supabase
	}

	// TODO: huntabyte authentication stuff

	function unpublish() {
		modal.show({
			content:
				'If you unpublish your game, it will be <span class="text-error">deleted from our servers<span/> and will not be visible to other players. <span class="text-success">Saves on your local device will be intact.<span/>',
			header: 'Unpublish Game',
			confirmText: 'UNPUBLISH',
			onConfirm: () => {
				// TODO:
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
		<h1>Publish</h1>
		<form on:submit|preventDefault={publish} />
		<button
			on:click={unpublish}
			class="btn-ghost btn border-none hover:border-none hover:bg-error hover:text-error-content"
			>Unpublish</button
		>
	</div>
</main>
