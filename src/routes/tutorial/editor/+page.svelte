<script lang="ts">
	const data = [
		{
			header: 'MAP EDITOR',
			icon: 'world-map',
			description:
				'As the name suggests, map editor lets you structure your world with emojis and colors.',
			gifs: [
				{
					header: 'Palette',
					description:
						'The first tool we will look at is the palette. You can paint the map however you want. If you want to paint the entire map with a color, simply select that color and click "SET AS DEFAULT".',
					src: '/images/palette.webm',
					alt: '',
				},
				{
					header: 'Emoji Mode',
					description:
						'Emoji mode will let you choose whether you want the emoji in the background or foreground. Emojis on the background can be walked over and will have lower opacity.',
					src: '/images/emoji-mode.webm',
					alt: '',
				},
				{
					header: 'Copy/Delete Mode',
					description:
						'Choose "Emoji" if you only want to change emojis. Choose "Color" if you only want to change the color. Choose both if you want to change both of them in a single cell.<br/><br/>This will also work for copying things. Right click on a cell to copy its contents.',
					src: '/images/copy-mode.webm',
					alt: '',
				},
				// TODO: add color only example
			],
		},
		{
			header: 'RULEBOX EDITOR',
			icon: 'books',
			description:
				"This is where you spawn ruleboxes and assign emojis to them. Most of your game logic will be created here. Right click on Rulebox Editor's canvas and spawn the Rulebox you like.",
			gifs: [
				{
					header: '',
					description: '',
					src: '/images/rulebox.webm',
					alt: '',
				},
			],
		},
		{
			header: 'DIALOGUE EDITOR',
			icon: 'speech-balloon',
			description:
				'Dialogue editor lets you create branching dialogues for Interactables. Create an Interactable in the Rulebox Editor, and edit its dialogue in Dialogue Editor.',
			gifs: [
				{
					header: '',
					description: '',
					src: '/images/dialogue.webm',
					alt: '',
				},
				{
					header: '',
					description:
						'You can create branching dialogues with player choices.',
					src: '/images/branching-dialogue.webm',
					alt: '',
				},
			],
		},
	];

	let width; // width of webm
</script>

<svelte:head>
	<title>Emojistan | Tutorial - Editor</title>
</svelte:head>

<div
	class="relative flex h-full w-full flex-row items-start justify-center gap-4 overflow-y-auto"
>
	<div class="relative flex w-full flex-col items-center justify-center">
		<div class="flex w-full self-start p-4">
			<div>
				<span class="flex-inline flex items-center">
					<h1>Editor</h1>
				</span>
				<p class="h-32 pt-2 text-gray-400">
					We have learned about the ruleboxes, now let's see how we can
					integrate them to our game. But to do that we have to understand the
					different types of editors in Emojistan.
				</p>
			</div>
		</div>

		{#each data as { header, icon, description, gifs }}
			<div class="w-full p-4 pb-32">
				<div class="divider pb-4">
					<h1>{header} <i class="twa twa-{icon}" /></h1>
				</div>
				<div class="self-start">
					<p class="text-gray-400">
						{description}
					</p>
					{#each gifs as { src, alt, header, description }}
						<div class="py-8" bind:clientWidth={width}>
							<h1>{header}</h1>
							<p class="pb-8 text-gray-400">{@html description}</p>
							<img {src} {alt} />
							<video {width} autoplay loop controls>
								<track kind="captions" />
								<source {src} type="video/webm" />
							</video>
						</div>
					{/each}
				</div>
			</div>
		{/each}
		<a href="/" class="btn-lg btn mb-32">BACK TO MENU</a>
	</div>
</div>
