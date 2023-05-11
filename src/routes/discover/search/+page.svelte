<script lang="ts">
	let searchType: 'games' | 'profiles' = 'games';
	let query = '';

	function search() {
		// TODO: query db
		// TODO: query in url
	}
</script>

<div class="flex flex-row gap-2">
	<form class="relative w-full" on:submit|preventDefault={search}>
		<input
			type="text"
			class="input-bordered input w-full"
			bind:value={query}
			required
		/>
		<button
			class="btn-ghost btn-sm btn absolute right-0.5 h-full border-none hover:border-none"
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
					d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
				/>
			</svg>
		</button>
	</form>
	<select class="select-bordered select" bind:value={searchType}>
		<option value="games">Games</option>
		<option value="profiles">Profiles</option>
	</select>
	<i
		class="twa text-4xl twa-{searchType == 'games'
			? 'joystick'
			: 'alien-monster'}"
	/>
</div>
