<script lang="ts">
	import type { Choice } from '$src/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { dialogueTree as dt } from '$src/store';
	const dispatch = createEventDispatcher();

	export let character = '🐸';
	export let dialogueID: string;
	export let dialogueTree = new Map<string, Array<string | Choice>>();
	let choicesForm: HTMLFormElement;
	let choiceIndex = 0;

	let mainBranches: Array<string> = [];
	let subBranches: Array<string> = [];
	let currentBranch = dialogueID[0];
	let currentSubBranch = dialogueID;
	let chatIndex = 0;
	let animating = false;
	let answerIndexes: Array<number> = [];
	let currentDialogue: Array<string | Choice>;
	let texts: Array<string> = [];
	let choices: Array<Choice> = [];

	onMount(() => {
		if (dialogueTree.size == 0) {
			dialogueTree = new Map<string, Array<string | Choice>>($dt);
		}

		for (let key of dialogueTree.keys()) {
			if (key.split('_').length == 1) {
				mainBranches.push(key);
			}

			if (key[0] == currentBranch) {
				subBranches.push(key);
			}
		}

		currentDialogue = dialogueTree.get(currentSubBranch) || [];
		subBranchChanged();
		chatIndex++;
	});

	function makeChoice() {
		let { to, text } = choices[choiceIndex];
		chatIndex = chatIndex - choices.length + 1;
		choices = [];
		texts = [...texts, text];
		answerIndexes.push(texts.length - 1);
		currentSubBranch = to;
		subBranchChanged();
	}

	function subBranchChanged() {
		currentDialogue = dialogueTree.get(currentSubBranch) || [];
		if (!currentDialogue) return;

		for (let item of currentDialogue) {
			if (typeof item == 'string') {
				texts.push(item);
			} else {
				choices.push(item);
			}
		}

		texts = texts;
		choices = choices;
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
				children[choiceIndex].click();
				return;
			}

			if (e.code.includes('Arrow')) {
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
	style="background-color: rgba(0, 0, 0.5, 0.5);"
	class="absolute z-50 h-[672px] w-full 2xl:h-[716px]"
	transition:scale|local
>
	<h1 class="p-4 text-4xl">{character}</h1>
	<ul>
		{#each texts as text, i}
			{#if i < chatIndex && !animating}
				<li
					class="chat {answerIndexes.includes(i) ? 'chat-end' : 'chat-start'}"
					transition:fly|local={{ x: -100 }}
				>
					<span class="chat-bubble">
						{text}
					</span>
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
					{@const autofocus = i == 0}
					<button
						{autofocus}
						class="btn flex-grow focus:bg-green-500 focus:text-primary-content"
						type="submit"
						tabindex="0"
						transition:fly|local={{ x: 100 }}
						>{choice.text}
					</button>
				{/if}
			{/each}
		</form>
	</ul>
</div>

<style>
	.chat span {
		border-bottom-left-radius: 12px !important;
	}

	.chat span::before {
		display: none;
	}
</style>
