<script lang="ts">
	import type { Branch, Choice } from '$src/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { dialogueTree as dt } from '$src/store';
	const dispatch = createEventDispatcher();

	export let isTutorial = false;
	export let character = '🐸';
	export let dialogueID: string;
	export let dialogueTree = new Map<string, Branch>();
	let choicesForm: HTMLFormElement;
	let choiceIndex = 0;
	let currentBranch = dialogueID;
	let chatIndex = 0;
	let animating = false;
	let answerIndexes: Array<number> = [];
	let currentDialogue: Branch;
	let texts: Array<string> = [];
	let choices: Array<Choice> = [];

	onMount(() => {
		if (dialogueTree.size == 0) {
			dialogueTree = new Map<string, Branch>($dt);
		}

		currentDialogue = dialogueTree.get(currentBranch) || [];
		branchChanged();
		chatIndex++;
	});

	function makeChoice() {
    console.log(choices, choiceIndex);
		let { text, next, label } = choices[choiceIndex];
		chatIndex = chatIndex - choices.length + 1;
		choices = [];
		texts = [...texts, text];
		answerIndexes.push(texts.length - 1);
		currentBranch = next;
		// branchChanged();
	}

	function branchChanged() {
		currentDialogue = dialogueTree.get(currentBranch) || [];
		if (!currentDialogue) return;

		for (let i = 0; i < currentDialogue.length - 1; i++) {
			texts.push(currentDialogue[i] as string);
		}

		let lastItem = currentDialogue.at(-1);

		if (typeof lastItem === 'string') {
			texts.push(lastItem);
			texts = texts;
		} else {
			choices = lastItem as Array<Choice>;
		}

    console.log(texts, choices);
    
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (!currentDialogue) return;
		if (e.code == 'Escape') {
			dispatch('end');
			return;
		}

		// choosing
		if (chatIndex == currentDialogue.length) {
			const children = choicesForm.children;
			if (e.code == 'Space') {
				if (children.length == 0) {
					dispatch('end');
					return;
				}
				children[choiceIndex]?.click();
				return;
			}

			if (e.code.includes('Arrow') && children.length != 0) {
				if (e.code == 'ArrowRight') {
					choiceIndex++;
					if (choiceIndex == children.length) {
						choiceIndex = 0;
					}
				} else if (e.code == 'ArrowLeft') {
					choiceIndex--;
					if (choiceIndex < 0) {
						choiceIndex = children.length - 1;
					}
				}

				children[choiceIndex % children.length].focus();
			}
			return;
		}

		if (e.code == 'Space') {
			if (
				chatIndex == texts.length &&
				choices.length == 0 &&
				typeof texts.at(-1) == 'string'
			) {
				dispatch('end');
				return;
			}

			// choosing
			if (chatIndex == currentDialogue.length) return;
			chatIndex++;

			if (typeof currentDialogue[chatIndex - 1] == 'object') {
				chatIndex = currentDialogue.length;
			}
		}
	}}
/>

<div
	style="background-color: rgba(0, 0, 0.5, 0.8);"
	class="absolute z-50 flex flex-col items-start justify-start {isTutorial
		? 'h-[204px] w-[204px] 2xl:h-[236px] 2xl:w-[236px]'
		: 'h-[620px] w-[620px] 2xl:h-[716px] 2xl:w-[716px]'} w-full"
	transition:scale|local
>
	<h1 class="p-4 text-2xl"><i class="twa twa-{character}" /></h1>
	<ul>
		{#each texts as text, i}
			{#if i < chatIndex && !animating}
				<li
					class="rounded-xl bg-neutral p-2 text-lg text-neutral-content {answerIndexes.includes(
						i
					)
						? 'mr-2 self-end'
						: 'ml-2 self-start'}"
					transition:fly|local={{ x: -100 }}
				>
					{text}
				</li>
			{/if}
		{/each}
		<form
			class="flex flex-row gap-2 px-4 pt-1"
			bind:this={choicesForm}
			on:submit|preventDefault={makeChoice}
		>
			{#each choices as choice, i}
				{#if i + texts.length < chatIndex && !animating}
					<button
						class="btn flex-grow focus:bg-green-500 focus:text-primary-content"
						type="submit"
						tabindex="0"
						transition:fly|local={{ x: 100 }}
						>{choice.label}
					</button>
				{/if}
			{/each}
		</form>
	</ul>
</div>
