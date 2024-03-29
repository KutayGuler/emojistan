<script lang="ts">
	import type { Rulebox as TRulebox } from '$lib/types/index';
	import Rulebox from '$lib/Rulebox.svelte';
	import Game from '$src/views/Game.svelte';

	export let header: string | undefined = '';
	export let description = '';
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

<svelte:head>
	<title>Emojistan | Tutorial - {header}</title>
	<meta name="description" content={description} />
	<script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Tutorial",
      "name": {{header}},
      "author": {
        "@type": "Person",
        "name": "Kutay Güler"
      },
      "datePublished": "2023-05-27",
      "description": {{description}},
    }
	</script>
</svelte:head>

<div
	class="relative flex h-full w-full flex-row items-start justify-start gap-4"
>
	<div class="relative flex w-1/2 flex-col items-center justify-center">
		<div class="self-start">
			{#if header}
				<h1 class="text-2xl md:text-6xl">{header}</h1>
			{/if}
			<div class="pb-4 pt-2 text-xs md:text-base">
				<slot name="description">
					{@html description}
				</slot>
			</div>
		</div>
		{#key props}
			<div
				use:disableFocus
				aria-hidden="true"
				id="rbx"
				style="width: {rbx.width}px; height: {rbx.height}px;"
				class="pointer-events-none relative mb-12 mt-6 flex scale-75 flex-col justify-center md:mb-24 md:mt-12 md:scale-100"
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
