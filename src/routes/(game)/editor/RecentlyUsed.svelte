<script lang="ts">
	import { currentEmoji, currentSkin, recentlyUsed } from '$src/store';

	function pickEmoji(emoji: string) {
		$currentEmoji = emoji === $currentEmoji ? '' : emoji;
	}
</script>

<span class="pb-1 pt-4 text-xs text-neutral-content">Recently Used </span>
<div class="emojis flex flex-wrap-reverse justify-center">
	{#each [...$recentlyUsed] as name}
		{@const title = name.replaceAll('-', ' ')}
		<button
			class:selected={$currentEmoji === name}
			on:click={() => pickEmoji(name)}
			{title}
		>
			<i class="twa twa-{name.replace('_', $currentSkin)}" />
		</button>
	{/each}
</div>
