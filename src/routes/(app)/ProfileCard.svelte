<script lang="ts">
	export let profile: object;
</script>

<a
	href="/profile/{profile.username}"
	class="brutal flex h-48 w-48 flex-col items-center justify-center gap-2 rounded bg-base-300 text-neutral"
>
	<div class="placeholder avatar">
		<div class="w-24 rounded-full bg-neutral">
			<i class="twa twa-alien text-6xl" />
		</div>
	</div>
	{profile.username}
</a>
