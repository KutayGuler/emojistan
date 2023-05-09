<script lang="ts">
	import type { Rulebox as TRulebox } from '$lib/types/index';
	import Rulebox from '$lib/Rulebox.svelte';
	import Game from '$src/views/Game.svelte';

	export let header: string | undefined = '';
	export let subheader = '';
	export let description: string;
	export let rbx: TRulebox;
	export let props: any;
	export let gameProps: any;
	export let veilHeight = 0;
	export let veilColor = 'bg-indigo-50';

	function disableFocus(node: Element) {
		let keyboardfocusableElements = document.querySelectorAll(
			'#rbx a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		);

		keyboardfocusableElements = [...keyboardfocusableElements];
		keyboardfocusableElements.shift();

		for (let element of keyboardfocusableElements) {
			// element.ariaHidden = "true";
			element.tabIndex = -1;
		}
	}
</script>

<div
	class="relative flex h-full w-full flex-row items-start justify-start gap-4"
>
	<div class="relative flex w-1/2 flex-col items-center justify-center">
		<div class="self-start">
			{#if header}
				<h1 class="text-6xl">{header}</h1>
			{/if}
			<slot name="description">
				<p class="pb-4 pt-2">
					{@html description}
				</p>
			</slot>
		</div>
		{#key props}
			<div
				use:disableFocus
				aria-hidden="true"
				id="rbx"
				style="width: {rbx.width}px; height: {rbx.height}px;"
				class="pointer-events-none relative mb-24 mt-12 flex flex-col justify-center"
			>
				<Rulebox {rbx} {props} />
				<div
					style:height={veilHeight + 'px'}
					class="absolute bottom-0 z-10 {veilColor}"
				/>
			</div>
		{/key}
	</div>
	<div
		class="relative flex w-1/2 flex-col items-center justify-center self-center"
	>
		{#key gameProps}
			<Game {...gameProps} />
		{/key}
	</div>
</div>

<style>
	h1 {
		color: var(--header);
	}

	#rbx > * {
		pointer-events: none;
	}
</style>
