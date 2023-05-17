<script lang="ts">
	export let username: string;
</script>

<a
	href="/profile/{username}"
	class="brutal flex h-48 w-48 flex-col items-center justify-center gap-2 rounded bg-base-300 text-neutral"
>
	<div class="placeholder avatar">
		<div class="w-24 rounded-full bg-neutral">
			<i class="twa twa-detective text-6xl" />
		</div>
	</div>
	{username}
</a>
