<script lang="ts">
	import { fly } from 'svelte/transition';
	import Background from './Background.svelte';

	const phrases = [
		'Getting emojis ready...',
		'Feeding chickens banana...',
		'Talking to a baguette...',
		'Playing ping pong on the sea...',
		'Eating a radioactive cookie...',
		'Playing puzzle on ATM...',
		'Boxing with a broccoli...',
		'Celebrating a goose birthday...',
		'Playing violin as a squirrel...',
		'Roaming the desert as a Stegosaurus...',
		'Playing saxaphone on Saturn...',
		'Fencing with a train...',
	];

	let phraseIndex = Math.floor(Math.random() * phrases.length);

	setInterval(() => {
		phraseIndex = Math.floor(Math.random() * phrases.length);
	}, 3000);
</script>

<main
	class="absolute left-0 top-0 z-30 flex h-full w-full items-center justify-center bg-white p-4 text-2xl"
>
	<div class="absolute">
		{#key phraseIndex}
			<span in:fly>{phrases[phraseIndex]}</span>
		{/key}
		<span class="px-2" id="loading"><i class="twa twa-alien-monster" /></span>
	</div>
	<Background />
</main>

<style>
	@keyframes idle {
		100% {
			transform: translateY(-20px);
		}
	}

	#loading {
		animation: idle 300ms ease-out infinite alternate;
	}
</style>
