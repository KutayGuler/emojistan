<script lang="ts">
	const filters = ['Today', 'This Week', 'This Month', 'This Year', 'All Time'];
	let filterType = 'new';
</script>

<main
	class="flex h-screen w-screen flex-row items-center justify-around gap-4 p-4"
>
	<div
		class="brutal flex h-full w-full flex-col items-start justify-start rounded bg-neutral p-8"
	>
		<h3 class="text-accent-content">Discover</h3>
		<div class="flex flex-row gap-2">
			<div class="btn-group">
				{#each ['new', 'top'] as value}
					<input
						{value}
						type="radio"
						name="options"
						data-title={value}
						class={filterType === value ? 'btn btn-accent' : 'btn'}
						bind:group={filterType}
					/>
				{/each}
			</div>
			{#if filterType === 'top'}
				<select class="select-bordered select">
					{#each filters as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			{/if}
		</div>
		<div class="mt-4 flex w-full flex-col gap-4">
			<div class="h-24 w-full rounded bg-neutral-content">stuff</div>
		</div>
	</div>
	<aside class="brutal flex h-full w-fit flex-col gap-4 bg-secondary p-8">
		<div class="pb flex flex-row justify-between">
			<h3 class="text-secondary-content">Friends</h3>
			<button>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="white"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
					/>
				</svg>
			</button>
		</div>

		<input class="input-bordered input" type="text" placeholder="Search" />
		<div class="brutal h-24 w-full rounded bg-secondary-content p-4 ">
			<div class="flex flex-row gap-4">
				<div class="avatar">
					<div
						class="w-6 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
					>
						<img src="https://picsum.photos/200" alt="profile picture" />
					</div>
				</div>
				<p>username</p>
			</div>
		</div>
	</aside>
</main>

<style>
	main {
		background-color: #f0f9ff;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23bae6fd' fill-opacity='0.4' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E");
	}
</style>
