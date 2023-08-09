<script lang="ts">
	import { palette, DEFAULT_BG, DEFAULT_SIDE_LENGTH } from '$src/constants';
	import { notifications } from '$src/routes/notifications';
	import { currentEmoji, formattedEmoji, map, currentColor } from '$src/store';
	import type { CopyMode } from '$src/types';
	import RecentlyUsed from './RecentlyUsed.svelte';

	export let viewKey: 'editor' | 'rules' | 'dialogue' | 'publish';

	let sectionIndex = 0;

	const copyModes: Array<CopyMode> = ['Emoji', 'Color', 'Both'];
	const deleteTexts: { [key in CopyMode]: string } = {
		Emoji: 'EMOJIS',
		Color: 'COLORS',
		Both: 'ALL',
	};

	let copyMode = copyModes[2];
	let emojiMode: 'Foreground' | 'Background' = 'Foreground';

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

	let test = false;

	function toggleTest() {
		if (!map.hasControllable()) {
			notifications.warning('No controllable found in the starting section.');
			return;
		}

		test = !test;
		if (!test) {
			$currentEmoji = '';
		}
	}
</script>

<aside class="aside overflow-y-auto overflow-x-visible">
	{#if viewKey === 'editor'}
		<div class="flex flex-col">
			<button
				class="btn mb-8 bg-primary text-lg text-primary-content 2xl:btn-md hover:bg-primary-focus"
				on:click={toggleTest}>TEST</button
			>
			<div class="flex flex-col gap-2">
				<div class="form-control">
					<RecentlyUsed />
					<label for="emoji-mode" class="label">
						<span class="label-text text-xs text-neutral-content 2xl:text-base"
							>Emoji Mode
						</span>
					</label>
					<select
						id="emoji-mode"
						class="select-bordered select 2xl:text-base"
						bind:value={emojiMode}
					>
						{#each ['Foreground', 'Background'] as mode}
							<option value={mode}>{mode}</option>
						{/each}
					</select>
					<label for="copy-delete-mode" class="label">
						<span class="label-text text-xs text-neutral-content 2xl:text-base"
							>Copy / Delete Mode
						</span>
					</label>
					<select
						id="copy-delete-mode"
						class="select-bordered select 2xl:text-base"
						bind:value={copyMode}
					>
						{#each copyModes as mode}
							<option value={mode}>{mode}</option>
						{/each}
					</select>
				</div>
				<button
					class="btn bg-accent text-lg text-accent-content 2xl:btn-md hover:bg-accent-focus"
					on:click={clearMap}
					>CLEAR {deleteTexts[copyMode]}
				</button>
				<button
					id="filler"
					disabled={$currentEmoji === ''}
					class="btn w-full text-lg 2xl:btn-md"
					on:click={fillMap}
					>Fill With &nbsp;<i class="twa twa-{$formattedEmoji}" /></button
				>
				<label class="label pt-8">
					<span class="label-text text-xs text-neutral-content 2xl:text-base"
						>Palette
					</span></label
				>
				<div
					class="grid grid-cols-9 grid-rows-10 items-center justify-center gap-1"
				>
					{#each palette as color}
						{@const disabled = color === $map.dbg}
						<button
							{disabled}
							on:click={() => {
								$currentColor = $currentColor === color ? '' : color;
							}}
							class="h-5 w-5 rounded-sm border border-black duration-75 ease-out {disabled
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
						class="m-1 h-4 w-4 rounded 2xl:h-6 2xl:w-6"
						style:background={$currentColor}
					/>
					as default
				</button>
				<label class="label pt-8">
					<span class="label-text text-xs text-neutral-content 2xl:text-base"
						>World Map
					</span></label
				>
				<div
					id="world-map"
					class="grid h-[166px] w-[166px] grid-cols-12 grid-rows-12 gap-0.5 self-center"
				>
					{#each { length: DEFAULT_SIDE_LENGTH * DEFAULT_SIDE_LENGTH } as _, i}
						{@const selected = i == sectionIndex}
						<button
							on:click={() => (sectionIndex = i)}
							title={`Section #${i}`}
							class="relative h-[16px] w-[16px] duration-75 ease-out"
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
