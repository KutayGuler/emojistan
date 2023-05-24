<script lang="ts">
	// SVELTEKIT
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { emojis } from './emojis';

	// VIEWS
	import Game from '../../../views/Game.svelte';
	import Editor from '../../../views/Editor.svelte';

	// STORES
	import {
		currentEmoji,
		formattedEmoji,
		currentSkin,
		currentColor,
		saves,
		map,
		pushers,
		mergers,
		interactables,
		effectors,
		dialogueTree,
		showLoading,
		controllables,
		sequencers,
		recentlyUsed,
	} from '../../../store';
	import {
		CROSS,
		DEFAULT_BG,
		DEFAULT_SIDE_LENGTH,
		palette,
	} from '$src/constants';
	import { notifications } from '../../notifications';
	import { rbxStore } from '$lib/stores/store';

	import Svelvet from '$lib';
	import DialogueEditor from './DialogueEditor.svelte';
	import type { CopyMode, SkinTone } from '$src/types';
	import RecentlyUsed from './RecentlyUsed.svelte';

	onMount(() => {
		if ($saves.currentSaveID === '') {
			let saveExists = saves.useStorage();
			if (!saveExists) {
				goto('/', { replaceState: true });
				notifications.info('Failed to find save file.');
				return;
			}
		} else {
			$showLoading = false;
		}
		// STORE NAMES
		// CF #7
		for (let store of [
			map,
			pushers,
			mergers,
			effectors,
			interactables,
			controllables,
			sequencers,
			rbxStore,
			dialogueTree,
			recentlyUsed
		]) {
			store.useStorage($saves.currentSaveID);
		}
	});

	let currentCategory = 'pile-of-poo';
	let filter = '';
	let sectionIndex = 0;

	function handleKeydown(e: KeyboardEvent) {
		if (e.code === 'Escape') {
			$currentEmoji = '';
			$currentColor = '';
		}
	}

	function pickEmoji(emoji: string) {
		$currentEmoji = emoji === $currentEmoji ? '' : emoji;
		recentlyUsed.add(emoji);
	}

	let innerWidth: number;
	let innerHeight: number;

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
			$map.items.set(sectionIndex + '_' + i, $currentEmoji);
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

	type ViewKey = 'editor' | 'rules' | 'dialogue';
	const views: { [key in ViewKey]: string } = {
		editor: 'world-map|Map Editor',
		rules: 'books|Ruleboxes',
		dialogue: 'speech-balloon|Dialogue Editor',
	};

	let viewKey: ViewKey = 'editor';

	function changeViewTo(to: string) {
		viewKey = to as ViewKey;
	}

	function toggleTest() {
		test = !test;
		if (!test) {
			$currentEmoji = '';
		}
	}

	let [x, y] = [0, 0];

	const skins: [string, SkinTone][] = [
		['#ffdc5d', ''],
		['#f7d7c4', '-light-skin-tone'],
		['#d8b094', '-medium-light-skin-tone'],
		['#bb9167', '-medium-skin-tone'],
		['#8e562e', '-medium-dark-skin-tone'],
		['#613d30', '-dark-skin-tone'],
	];
</script>

<svelte:head>
	<title>Emojistan | Editor</title>
</svelte:head>

<svelte:window
	on:mousemove={(e) => {
		x = e.clientX;
		y = e.clientY;
	}}
	on:keydown={handleKeydown}
	bind:innerWidth
	bind:innerHeight
/>

<div
	style:background={$currentColor || 'none'}
	class="absolute z-50 flex h-6 w-6 items-center justify-center text-lg"
	style="transform: translate({x + 12}px, {y - 12}px);"
>
	<i class="twa twa-{$formattedEmoji}" />
</div>

{#if $saves.currentSaveID != ''}
	<main
		class="editor relative box-border flex h-screen flex-col items-center justify-center overflow-hidden"
	>
		{#if test}
			<button on:click={toggleTest} class="absolute right-4 top-4 z-10 text-4xl"
				>{CROSS}</button
			>
			<Game
				map={structuredClone($map)}
				pushers={$pushers}
				mergers={$mergers}
				controllables={$controllables}
				interactables={$interactables}
				sequencers={$sequencers}
				effectors={$effectors}
				dt={$dialogueTree}
				on:noPlayer={() => {
					test = false;
					notifications.warning('No controllable player in the map.');
				}}
				on:quit={() => {
					test = false;
				}}
			/>
			<div
				class="absolute bottom-8 left-8 flex flex-row items-center md:bottom-4 md:left-4"
			>
				<kbd class="kbd kbd-sm mr-2 2xl:kbd-md">Esc</kbd>
				<p class="2xl:text-md text-sm">Exit test mode</p>
			</div>
		{:else}
			<div
				class="flex h-full w-full flex-row items-center justify-center gap-4 text-lg 2xl:top-8 2xl:text-2xl"
			>
				{#each Object.entries(views) as [key, data]}
					{@const [icon, title] = data.split('|')}
					<button
						{title}
						class="{viewKey === key
							? 'scale-125 bg-primary'
							: 'bg-neutral'} btn-square rounded duration-200 ease-out hover:scale-125"
						on:click={() => changeViewTo(key)}
					>
						<i class="twa twa-{icon}" />
					</button>
				{/each}
			</div>
			{#if viewKey === 'dialogue'}
				<DialogueEditor />
			{:else}
				<div
					class="relative box-border flex flex-row items-center justify-center"
				>
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
											<span
												class="label-text text-xs text-neutral-content 2xl:text-base"
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
											<span
												class="label-text text-xs text-neutral-content 2xl:text-base"
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
										>Fill With &nbsp;<i
											class="twa twa-{$formattedEmoji}"
										/></button
									>
									<label class="label pt-8">
										<span
											class="label-text text-xs text-neutral-content 2xl:text-base"
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
										<span
											class="label-text text-xs text-neutral-content 2xl:text-base"
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
					{#if viewKey === 'editor'}
						<div class="flex flex-col justify-center px-8">
							<Editor {sectionIndex} {copyMode} {emojiMode} />
						</div>
					{:else if viewKey === 'rules'}
						<div class="flex flex-col justify-center px-8">
							<Svelvet />
						</div>
					{/if}
					<aside class="aside overflow-y-auto pt-0">
						<div
							class="sticky top-0 flex w-full flex-col items-center justify-center gap-4 bg-slate-500 p-4 pt-8"
						>
							<input
								class="input-bordered input input-sm w-full 2xl:input-md"
								type="text"
								placeholder="Search"
								bind:value={filter}
							/>
							<div class="my-4 grid grid-cols-4 grid-rows-2 gap-4">
								{#each Object.keys(emojis) as category}
									<button
										class="{category === currentCategory
											? 'scale-125'
											: 'opacity-50 hover:scale-125 hover:opacity-100'} duration-75 ease-out"
										on:click={() => (currentCategory = category)}
									>
										<i class="twa twa-{category} text-2xl" />
									</button>
								{/each}
							</div>
							<div class="flex flex-row gap-2">
								{#each skins as [hexcode, skinName]}
									{@const selected = $currentSkin === skinName}
									<button
										class="brutal h-6 w-6 rounded duration-75 ease-out {selected
											? 'scale-125'
											: 'hover:scale-125'}"
										style:background={hexcode}
										on:click={() => {
											$currentSkin = selected ? '' : skinName;
										}}
									/>
								{/each}
							</div>
						</div>
						<div id="flex flex-col">
							{#each Object.keys(emojis) as category}
								{#if currentCategory === category}
									<div class="emojis flex flex-wrap justify-center">
										{#each emojis[category] as name}
											{@const title = name.replaceAll('-', ' ')}
											{#if title.includes(filter)}
												<button
													class:selected={$currentEmoji === name}
													on:click={() => pickEmoji(name)}
													{title}
												>
													<i
														class="twa twa-{name.replace('_', $currentSkin)}"
													/>
												</button>
											{/if}
										{/each}
									</div>
								{/if}
							{/each}
						</div>
					</aside>
				</div>
			{/if}

			<div
				class="relative flex h-full w-full flex-col items-center justify-center"
			>
				<div
					class="absolute bottom-8 left-8 flex flex-row items-center md:bottom-4 md:left-4"
				>
					<kbd class="kbd kbd-sm mr-2 2xl:kbd-md">Esc</kbd>
					<p class="2xl:text-md text-sm">untoggle emoji / color</p>
				</div>
			</div>
		{/if}
	</main>
{/if}

<style>
	.hintsEnabled {
		opacity: 1;
	}

	.tooltip:before {
		z-index: 10;
	}

	.selected,
	#world-map > button:hover {
		outline: solid 2px black;
		z-index: 2;
	}

	#world-map > button:hover:not(.selected) {
		scale: 110%;
	}
</style>
