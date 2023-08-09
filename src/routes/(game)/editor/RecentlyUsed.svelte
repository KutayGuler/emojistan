<script lang="ts">
	import { currentEmoji, currentSkin, recentlyUsed } from '$src/store';

	function pickEmoji(emoji: string) {
		$currentEmoji = emoji === $currentEmoji ? '' : emoji;
	}
</script>

<label for="recently-used" class="label">
	<span class="label-text text-xs text-neutral-content md:text-base"
		>Recently Used
	</span>
</label>
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
