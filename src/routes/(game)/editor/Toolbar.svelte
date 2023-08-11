<script lang="ts">
	import { palette, DEFAULT_BG, DEFAULT_SIDE_LENGTH } from '$src/constants';
	import { currentEmoji, formattedEmoji, map, currentColor } from '$src/store';
	import type { CopyMode } from '$src/types';
	import { createEventDispatcher } from 'svelte';
	import RecentlyUsed from './RecentlyUsed.svelte';
	const dispatch = createEventDispatcher();

	export let deleteTexts: { [key in CopyMode]: string };
	export let copyModes: Array<CopyMode>;
	export let viewKey: 'editor' | 'rules' | 'dialogue' | 'publish';
	export let sectionIndex: number;
	export let copyMode: CopyMode;
	export let emojiMode: 'Foreground' | 'Background' = 'Foreground';

	function fillMap() {
		if ($currentEmoji === '') return;
		for (let i = 0; i < DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH; i++) {
			$map.items.set(`${sectionIndex}_${i}`, $currentEmoji);
		}
		$map = $map;
	}

	function clearMap() {
		switch (copyMode) {
			case 'Emoji':
				map.clearItems(sectionIndex);
				break;
			case 'Color':
				map.clearColors(sectionIndex);
				break;
			case 'Both':
				map.clearAll(sectionIndex);
				break;
		}
	}
</script>

<aside class="aside overflow-y-auto overflow-x-visible">
	{#if viewKey === 'editor'}
		<div class="flex flex-col">
			<button
				class="btn bg-primary text-primary-content 2xl:btn-md hover:bg-primary-focus"
				on:click={() => dispatch('test')}>TEST</button
			>
			<div class="flex flex-col gap-2">
				<div class="form-control">
					<RecentlyUsed />
					<span class="pt-4 text-xs text-neutral-content pb-1">Emoji Mode </span>
					<select
						id="emoji-mode"
						class="select-bordered select select-xs md:select-md"
						bind:value={emojiMode}
					>
						{#each ['Foreground', 'Background'] as mode}
							<option value={mode}>{mode}</option>
						{/each}
					</select>
					<span class="pb-1 pt-4 text-xs text-neutral-content"
						>Copy / Delete Mode
					</span>
					<select
						id="copy-delete-mode"
						class="select-bordered select select-xs md:select-md"
						bind:value={copyMode}
					>
						{#each copyModes as mode}
							<option value={mode}>{mode}</option>
						{/each}
					</select>
				</div>
				<button
					class="btn-xs btn bg-accent text-accent-content md:btn-md hover:bg-accent-focus"
					on:click={clearMap}
					>CLEAR {deleteTexts[copyMode]}
				</button>
				<button
					id="filler"
					disabled={$currentEmoji === ''}
					class="btn w-full text-xs md:text-base"
					on:click={fillMap}
					>Fill With &nbsp;<i class="twa twa-{$formattedEmoji}" /></button
				>
				<span class="pt-4 text-xs text-neutral-content">Palette </span>
				<div
					class="grid-rows-10 grid grid-cols-9 items-center justify-center gap-1"
				>
					{#each palette as color}
						{@const disabled = color === $map.dbg}
						<button
							{disabled}
							on:click={() => {
								$currentColor = $currentColor === color ? '' : color;
							}}
							class="h-3 w-3 rounded-sm border border-black duration-75 ease-out md:h-5 md:w-5 {disabled
								? ''
								: 'hover:scale-125'}  2xl:h-6 2xl:w-6"
							style:background-color={color}
						/>
					{/each}
				</div>
				<button
					on:click={() => {
						if ($currentColor === '') return;
						if ($currentColor === $map.dbg) {
							map.updateDefaultColor(DEFAULT_BG);
							return;
						}

						map.updateDefaultColor($currentColor);
						map.filterColors();
					}}
					disabled={$currentColor === ''}
					class="btn flex w-full flex-row items-center"
				>
					Set <div
						class="m-1 h-3 w-3 rounded md:h-4 md:w-4 2xl:h-6 2xl:w-6"
						style:background={$currentColor}
					/>
					as default
				</button>
				<span class="text-xs text-neutral-content pt-4">World Map </span>
				<div id="world-map" class="grid grid-cols-12 grid-rows-12 self-center">
					{#each { length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH } as _, i}
						{@const selected = i == sectionIndex}
						<button
							on:click={() => (sectionIndex = i)}
							title={`Section #${i}`}
							class="relative h-4 w-4 duration-75 ease-out"
							class:selected
							style:background-color={$map.dbg}
						>
							{#if $map.ssi == i}
								<i class="twa twa-chequered-flag" />
							{/if}
						</button>
					{/each}
				</div>
				<button
					on:click={() => map.updateStartingSection(sectionIndex)}
					class="btn mt-1 flex w-full flex-row items-center"
				>
					Set as &nbsp;<i class="twa twa-chequered-flag" />
				</button>
			</div>
		</div>
	{:else if viewKey == 'rules'}
		<RecentlyUsed />
	{/if}
</aside>
