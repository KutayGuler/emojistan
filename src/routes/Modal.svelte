<script lang="ts">
	import { CROSS } from '$src/constants';
	import { modal } from '$src/store';

	let dialog: HTMLDialogElement;

	$: if (dialog && $modal.visible) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="brutal prose h-fit w-96 bg-neutral text-neutral-content"
	bind:this={dialog}
	on:close={() => ($modal.visible = false)}
	on:click|self={() => dialog.close()}
>
	<div on:click|stopPropagation>
		<h3 class="text-neutral-content">{$modal.header}</h3>
		<p>{$modal.content}</p>
		<!-- svelte-ignore a11y-autofocus -->
		<button
			class="absolute top-4 right-4"
			autofocus
			on:click={() => dialog.close()}>{CROSS}</button
		>
	</div>
	<div class="flex flex-row justify-end gap-2">
		<button
			class="btn"
			on:click={() => {
				$modal.visible = false;
				dialog.close();
			}}>CANCEL</button
		>
		<button class="btn-error btn" on:click={$modal.onConfirm}
			>{$modal.confirmText}</button
		>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
