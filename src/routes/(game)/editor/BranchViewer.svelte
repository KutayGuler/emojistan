<script lang="ts">
	import { CROSS, EFFECTOR_BORDER, MAX_INVENTORY_SIZE } from '$src/constants';
	import { dialogueTree, effectors } from '$src/store';
	export let currentBranch = '';
	export let nextBranch = '';
	export let layer = 1;
	let text = '';
	let textEditIndex = -1;
	let editValue = '';

	let choiceEditIndex = -1;
	let choiceLabel = '';
	let choiceText = '';

	function toggleNextBranch(next: string) {
		nextBranch = nextBranch === next ? '' : next;
	}

	function addChoice() {
		if (text === '') return;
		dialogueTree.addChoiceTo(currentBranch, text);
		text = '';
	}

	function addText() {
		if (text === '') return;
		dialogueTree.addTextTo(currentBranch, text);
		text = '';
	}

	function attemptDelete(next: string) {
		dialogueTree.removeChoice(currentBranch, next);
		choiceEditIndex = -1;
		choiceLabel = '';
		choiceText = '';
	}

	$: if (currentBranch !== '' && !$dialogueTree.has(currentBranch)) {
		dialogueTree.add(currentBranch);
		break $;
	}

	$: choiceDisabled =
		$dialogueTree.get(currentBranch)?.length === 0 ||
		(typeof $dialogueTree.get(currentBranch)?.at(-1) !== 'string' &&
			$dialogueTree.get(currentBranch)?.at(-1)?.length === 4);

	$: droppables = [...$effectors].filter(([id, e]) => e.emoji != '');
</script>

<svelte:window
	on:keypress={(e) => {
		if (e.code === 'Escape') {
			[textEditIndex, choiceEditIndex] = [-1, -1];
			[editValue, choiceLabel, choiceText] = ['', '', ''];
		}
	}}
/>

<div class="flex w-full flex-col gap-2">
	{#if $dialogueTree.get(currentBranch)}
		{@const branch = $dialogueTree.get(currentBranch)}
		<div class="mb-2 h-full w-full rounded border-2 border-black p-4">
			<div class="mb-4 flex flex-row gap-2">
				<input class="input-bordered input w-full" bind:value={text} />
				<button class="btn" on:click={addText}>ADD AS TEXT</button>
				<button disabled={choiceDisabled} class="btn" on:click={addChoice}
					>ADD AS CHOICE</button
				>
			</div>
			{#each branch as leaf, i}
				{@const isString = typeof leaf === 'string'}
				{#if isString}
					<div class="flex flex-row items-start gap-2">
						<button
							on:click={() => {
								$dialogueTree.get(currentBranch)?.splice(i, 1);
								$dialogueTree = $dialogueTree;
							}}>{CROSS}</button
						>
						<button
							class="h-6"
							on:click={() => {
								// @ts-expect-error
								editValue = leaf;
								if (textEditIndex === i) {
									textEditIndex = -1;
								} else {
									textEditIndex = i;
								}
							}}
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="h-6 w-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
								/>
							</svg>
						</button>
						{#if textEditIndex === i}
							<form
								on:submit={() => {
									textEditIndex = -1;
									leaf = editValue;
								}}
							>
								<input
									class="input-bordered input input-sm"
									type="text"
									bind:value={editValue}
								/>
							</form>
						{:else}
							<p>{leaf}</p>
						{/if}
					</div>
				{:else if Array.isArray(leaf)}
					<div class="mt-4 flex flex-grow flex-row items-start gap-2">
						{#each leaf as choice, i}
							{@const chosen = choice.next === nextBranch}
							<div
								class="relative flex h-full w-1/4 flex-col gap-2 rounded-xl border-2 {chosen
									? 'border-secondary'
									: 'border-black'}"
							>
								<button
									class="btn {chosen
										? 'btn-secondary'
										: ''} w-full border-none focus:border-none"
									on:click={() => toggleNextBranch(choice.next)}
									>{choice.label}</button
								>
								<p class="h-fit px-2">{choice.text}</p>
								<div class="h-full flex-grow" />
								<div class="flex w-full flex-row items-end justify-end p-2">
									<button
										on:click={() => {
											if (choiceEditIndex === i) {
												choiceEditIndex = -1;
												return;
											}

											choiceEditIndex = i;
											choiceLabel = choice.label;
											choiceText = choice.text;
										}}
										class="h-fit w-fit pt-2"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="h-6 w-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
											/>
										</svg>
									</button>
								</div>
								{#if choiceEditIndex === i}
									<div
										class="absolute -bottom-52 flex w-full flex-col gap-2 rounded border-2 border-black bg-slate-300 p-2"
									>
										<form
											class="flex w-full flex-col gap-2"
											on:submit={() => {
												choice.label = choiceLabel;
												choice.text = choiceText;
												choiceEditIndex = -1;
											}}
										>
											<input
												class="input-bordered input input-sm"
												type="text"
												bind:value={choiceLabel}
											/>
											<input
												class="input-bordered input input-sm"
												type="text"
												bind:value={choiceText}
											/>
											constraint
											<div class="dropdown-right dropdown">
												<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
												<label
													for=""
													tabindex="0"
													class="btn bg-purple-500 text-2xl"
													style:background={EFFECTOR_BORDER}
													>
													{#if choice.constraint.emoji}
														 <i class="twa twa-{choice.constraint.emoji}"></i>
													{:else}
														 +
													{/if}
													<!-- TODO: constraint -->
												</label
												>
												<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
												<ul
													tabindex="0"
													class="dropdown-content menu rounded-box bg-base-100 p-2 shadow"
												>
													{#each droppables as [id, { emoji }]}
														<button
															on:click={() => {
																if (choice.constraint.emoji == emoji) {
																	choice.constraint.emoji == '';
																	return;
																}
																choice.constraint.emoji = emoji;
															}}
															class="rounded-md p-1 hover:bg-base-200"
														>
															<i class="twa twa-{emoji}" />
														</button>
													{:else}
														<div class="rounded-md p-1">
															No effectors defined.
														</div>
													{/each}
												</ul>
											</div>
											<select
												class="select-bordered select select-sm"
												name="constraint"
												bind:value={choice.constraint.count}
											>
												{#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as value}
													<option {value}>{value}</option>
												{/each}
											</select>
											<button class="btn-primary btn" type="submit">SAVE</button
											>
										</form>
										<button
											on:click={() => attemptDelete(choice.next)}
											class="btn-error btn-ghost btn"
											type="submit">DELETE</button
										>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

{#key nextBranch}
	{#if $dialogueTree.has(nextBranch)}
		<svelte:self currentBranch={nextBranch} layer={layer + 1} />
	{/if}
{/key}
