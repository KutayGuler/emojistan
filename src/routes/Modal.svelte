<script lang="ts">
	import { CROSS } from '$src/constants';
	import { modal } from '$src/store';

	let dialog: HTMLDialogElement;

	$: if (dialog && $modal.visible) dialog.showModal();

	let inputValue = '';

	function confirm() {
		dialog.close();
		$modal.onConfirm(inputValue);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="brutal h-fit w-96 bg-neutral"
	bind:this={dialog}
	on:close={() => ($modal.visible = false)}
	on:click|self={() => dialog.close()}
>
	<div
		class="flex flex-col gap-8 text-neutral-content"
		on:click|stopPropagation
	>
		<h3>{$modal.header}</h3>
		<p class="text-neutral-300">{$modal.content}</p>
		<button class="absolute top-4 right-4" on:click={() => dialog.close()}
			>{CROSS}</button
		>
	</div>
	{#if $modal.input}
		<input type="text" class="input-bordered input" bind:value={inputValue} />
	{/if}
	<div class="mt-8 flex flex-row justify-end gap-2">
		<button
			class="btn"
			on:click={() => {
				$modal.visible = false;
				dialog.close();
			}}>CANCEL</button
		>
		<button
			disabled={$modal.input && inputValue.length < 2}
			class="btn {$modal.danger ? 'btn-error' : 'btn-primary'}"
			on:click={confirm}>{$modal.confirmText}</button
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
