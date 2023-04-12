<script lang="ts">
	import { fly } from 'svelte/transition';

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

	let phraseIndex = 0;

	setInterval(() => {
		phraseIndex = Math.floor(Math.random() * phrases.length);
	}, 3000);
</script>

<main
	class="absolute z-20 flex h-full w-full items-end justify-end p-4 text-2xl text-slate-300"
>
	{#key phraseIndex}
		<span in:fly>{phrases[phraseIndex]}</span>
	{/key}
	<span class="px-2" id="loading">👾</span>
</main>

<style>
	main {
		background-image: url('emojis.png');
		background-size: cover;
	}

	@keyframes idle {
		100% {
			transform: translateY(-20px);
		}
	}

	#loading {
		animation: idle 300ms ease-out infinite alternate;
	}
</style>
