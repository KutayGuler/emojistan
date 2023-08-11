<script lang="ts">
	// SVELTEKIT
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// VIEWS
	import Game from '../../../views/Game.svelte';
	import Editor from '../../../views/Editor.svelte';

	// STORES
	import {
		currentEmoji,
		formattedEmoji,
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
	} from '$src/store';
	import { CROSS } from '$src/constants';
	import { notifications } from '../../notifications';
	import { rbxStore } from '$lib/stores/store';

	import Svelvet from '$lib';
	import DialogueEditor from './DialogueEditor.svelte';
	import type { CopyMode } from '$src/types';
	import Publish from '$src/views/Publish.svelte';
	import EmojiSelector from './EmojiSelector.svelte';
	import Toolbar from './Toolbar.svelte';

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
			recentlyUsed,
		]) {
			store.useStorage($saves.currentSaveID);
		}
	});

	let sectionIndex = 0;

	function handleKeydown(e: KeyboardEvent) {
		if (e.code === 'Escape') {
			$currentEmoji = '';
			$currentColor = '';
		}
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

	let test = false;

	type ViewKey = 'editor' | 'rules' | 'dialogue'; // | 'publish'
	const views: { [key in ViewKey]: string } = {
		editor: 'world-map|Map Editor',
		rules: 'books|Ruleboxes',
		dialogue: 'speech-balloon|Dialogue Editor',
		// publish: 'floppy-disk|Publish',
	};

	let viewKey: ViewKey = 'editor';

	function changeViewTo(to: string) {
		viewKey = to as ViewKey;
	}

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

	let [x, y] = [0, 0];
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
		class="editor relative box-border flex h-screen flex-col-reverse items-center justify-center overflow-hidden md:flex-col"
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
							: 'bg-neutral'} btn-square btn-xs rounded duration-200 ease-out md:btn-md hover:scale-125"
						on:click={() => changeViewTo(key)}
					>
						<i class="twa twa-{icon}" />
					</button>
				{/each}
			</div>
			{#if viewKey === 'dialogue'}
				<DialogueEditor />
			<!-- {:else if viewKey == 'publish'}
				<Publish /> -->
			{:else}
				<div
					class="relative box-border flex flex-row items-center justify-center"
				>
					<Toolbar
						{deleteTexts}
						{copyModes}
						bind:viewKey
						bind:copyMode
						bind:emojiMode
						bind:sectionIndex
						on:test={toggleTest}
					/>
					{#if viewKey === 'editor'}
						<div class="md:x-8 flex flex-col justify-center px-4">
							<Editor {sectionIndex} {copyMode} {emojiMode} />
						</div>
					{:else if viewKey === 'rules'}
						<div class="flex flex-col justify-center px-4 md:px-8">
							<Svelvet />
						</div>
					{/if}
					<EmojiSelector />
				</div>
			{/if}
			<div class="hidden h-full sm:block" />
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

	.selected {
		outline: solid 2px black;
		z-index: 2;
	}
</style>
