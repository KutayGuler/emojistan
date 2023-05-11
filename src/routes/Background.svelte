<script lang="ts">
	import { emojis } from './editor/emojis';
	import { fade } from 'svelte/transition';

	let randomEmojis: Array<string> = [];

	function random(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	for (let array of Object.values(emojis)) {
		randomEmojis.push(array[Math.round(random(0, array.length))]);
		randomEmojis.push(array[Math.round(random(0, array.length))]);
	}

	const [min, max, minDeg, maxDeg] = [0, 100, -180, 180];

	function transform(isSmall: boolean) {
		let [x, y, deg, s] = [
			random(min, max),
			random(min, max),
			random(minDeg, maxDeg),
			random(1, isSmall ? 5 : 2.5),
		];

		return `translate(${x}vw, ${y}vh) rotate(${deg}deg) scale(${s}, ${s})`;
	}

	function interpolate(node: Element) {
		let time = random(50, 100);
		node.style.transition = `transform ${time}s`;
		node.style.transform = transform(node.classList.contains('small'));
		time = node.init ? time : 0;
		setTimeout(() => {
			node.init = true;
			interpolate(node);
		}, time * 1000 + 1000);
	}
</script>

<div transition:fade class="h-screen w-screen">
	{#each randomEmojis as emoji, i}
		<ins
			use:interpolate={this}
			class="{i % 2 == 0
				? 'text-2xl'
				: 'text-4xl'} shape twa twa-{emoji} left-0 top-0"
		/>
	{/each}
</div>

<style>
	.shape {
		position: absolute;
		overflow: visible;
	}
</style>
