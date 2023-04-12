<script lang="ts">
	import type { Branch, Choice } from '$src/types';
	import {
		afterUpdate,
		beforeUpdate,
		createEventDispatcher,
		onMount,
	} from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { dialogueTree as dt } from '$src/store';
	const dispatch = createEventDispatcher();

	export let isTutorial = false;
	export let character: string;
	export let dialogueID: string;
	export let dialogueTree = new Map<string, Branch>();
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

	function makeChoice(e: SubmitEvent) {
		let text = e.submitter?.dataset.text as string;
		let next = e.submitter?.dataset.next as string;
		choices = [];
		texts.push(text);
		texts = texts;
		answerIndexes.push(texts.length - 1);
		currentBranch = next;
		interacting = false;
		branchChanged();
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
	}

	let container: HTMLElement;
	let autoscroll = false;

	beforeUpdate(() => {
		autoscroll =
			container &&
			container.offsetHeight + container.scrollTop >
				container.scrollHeight - container.offsetHeight * 0.1;
	});

	afterUpdate(() => {
		if (autoscroll) {
			container.scrollTo(0, container.scrollHeight);
		}
	});

	let interacting = false;

	function choicesSpawned(node: Element) {
		interacting = true;
	}

	// TODO: fix crashing on empty arrays
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.code == 'Escape') {
			dispatch('end');
			return;
		}

		console.log(e.code);

		if (interacting) return;

		if (e.code == 'Space') {
			chatIndex++;
		}

		if (chatIndex == texts.length + choices.length + 1) {
			dispatch('end');
		}
	}}
/>

<div
	bind:this={container}
	style="background-color: rgba(0, 0, 0.5, 0.8);"
	class="absolute z-50 flex flex-col items-start justify-start {isTutorial
		? 'h-[204px] w-[204px] 2xl:h-[236px] 2xl:w-[236px]'
		: 'h-[624px] w-[624px] 2xl:h-[720px] 2xl:w-[720px]'} w-full overflow-y-auto overflow-x-hidden  backdrop-blur"
	transition:scale|local
>
	<h1 class="p-4 text-2xl"><i class="twa twa-{character}" /></h1>
	<ul class="flex w-full flex-col gap-2">
		{#each texts as text, i}
			{#if i < chatIndex && !animating}
				{@const isAnswer = answerIndexes.includes(i)}
				<li
					class="max-w-xs rounded-xl bg-neutral p-2 px-4 text-lg text-neutral-content {isAnswer
						? 'mr-2 self-end'
						: 'ml-2 self-start'}"
					transition:fly={{ x: isAnswer ? 100 : -100 }}
				>
					{text}
				</li>
			{/if}
		{/each}
	</ul>
	{#if chatIndex == texts.length + 1}
		<form
			use:choicesSpawned
			class="flex flex-wrap gap-2 p-2"
			on:submit|preventDefault={makeChoice}
		>
			{#each choices as choice, i}
				<button
					data-text={choice.text}
					data-next={choice.next}
					class="btn-secondary btn flex-grow"
					type="submit"
					in:scale={{ delay: i * 100 }}
				>
					{choice.label}
				</button>
			{/each}
		</form>
	{/if}
</div>
