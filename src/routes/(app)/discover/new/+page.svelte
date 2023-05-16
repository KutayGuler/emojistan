<script lang="ts">
	import { fly } from 'svelte/transition';

	export let data;
</script>

{#if data.games}
	<div class="h-full overflow-y-auto">
		{#each data.games as { id, name, profiles }, i}
			<div
				in:fly={{ delay: (i + 1) * 80, x: 200 }}
				class="brutal relative mb-2 flex h-56 flex-col rounded-lg bg-slate-300 p-4"
			>
				<div class="flex flex-col gap-2 pb-4">
					<h3>{name}</h3>
					{#if profiles}
						<a href="/profile/{profiles.username}" class="link"
							>{profiles.username}</a
						>
					{/if}
				</div>
				<!-- TODO: emojiFreqs -->
				<!-- <p>
		{#each [...(emojiFreqs.get(id) || [])] as e}
			<i class="twa text-4xl twa-{e}" />
		{/each}
	</p> -->
				<div class="flex flex-grow" />
				<a
					href="/games/{id}"
					on:click={() => {
						// TODO play
					}}
					class="btn-sm btn self-end">PLAY</a
				>
			</div>
		{/each}
	</div>
{/if}
