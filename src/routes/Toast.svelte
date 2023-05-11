<script lang="ts">
	// @ts-nocheck
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications, type NotificationType } from './notifications';

	function generateTailwindClass(type: NotificationType) {
		switch (type) {
			case 'success':
				return 'bg-primary';
			case 'info':
				return 'bg-info';
			case 'warning':
				return 'bg-warning';
			case 'error':
				return 'bg-error';
		}
	}
</script>

<div
	class="pointer-events-none fixed bottom-4 right-4 z-20 flex w-80 flex-col items-center justify-start"
>
	{#each $notifications as notification (notification.id)}
		<div
			animate:flip
			class:shake={notification.shake}
			class="brutal mt-2 h-fit rounded {generateTailwindClass(
				notification.type
			)}"
			transition:fly={{ y: -30 }}
		>
			<div class="p-4 text-2xl">{notification.message}</div>
			{#if notification.icon}<i class={notification.icon} />{/if}
		</div>
	{/each}
</div>

<style>
	@keyframes shake {
		10%,
		90% {
			transform: translateX(-2px);
		}

		20%,
		80% {
			transform: translateX(4px);
		}

		30%,
		50%,
		70% {
			transform: translateX(-8px);
		}

		40%,
		60% {
			transform: translateX(8px);
		}
	}

	.shake {
		animation: shake 50ms 8 alternate;
	}
</style>
