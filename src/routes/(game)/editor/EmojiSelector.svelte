<script lang="ts">
	import { emojis } from './emojis';
	import { currentEmoji, currentSkin, recentlyUsed } from '$src/store';
	import type { SkinTone } from '$src/types';

	let currentCategory = 'pile-of-poo';
	let filter = '';

	function pickEmoji(emoji: string) {
		$currentEmoji = emoji === $currentEmoji ? '' : emoji;
		recentlyUsed.add(emoji);
	}

	const skins: [string, SkinTone][] = [
		['#ffdc5d', ''],
		['#f7d7c4', '-light-skin-tone'],
		['#d8b094', '-medium-light-skin-tone'],
		['#bb9167', '-medium-skin-tone'],
		['#8e562e', '-medium-dark-skin-tone'],
		['#613d30', '-dark-skin-tone'],
	];
</script>

<aside class="aside overflow-y-auto pt-0">
	<div
		class="sticky top-0 flex w-full flex-col items-center justify-center md:gap-4 gap-2 bg-slate-500 md:p-4 p-2 pt-4 md:pt-8"
	>
		<input
			class="input-bordered input input-xs w-full md:input-sm 2xl:input-md"
			type="text"
			placeholder="Search"
			bind:value={filter}
		/>
		<div class="my-2 grid grid-cols-4 grid-rows-2 gap-2 md:my-4 md:gap-4">
			{#each Object.keys(emojis) as category}
				<button
					class="{category === currentCategory
						? 'scale-125'
						: 'opacity-50 hover:scale-125 hover:opacity-100'} duration-75 ease-out"
					on:click={() => (currentCategory = category)}
				>
					<i class="twa twa-{category} text-xs md:text-2xl" />
				</button>
			{/each}
		</div>
		<div class="flex flex-row gap-1 md:gap-2">
			{#each skins as [hexcode, skinName]}
				{@const selected = $currentSkin === skinName}
				<button
					class="brutal h-3 w-3 rounded duration-75 ease-out md:h-6 md:w-6 {selected
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
								<i class="twa twa-{name.replace('_', $currentSkin)}" />
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</aside>
