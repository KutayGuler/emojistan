<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.profileData.bio}
	<p class="text-2xl">
		{data.profileData.bio} Lorem ipsum dolor sit amet consectetur adipisicing elit.
		Ut odio eius provident. Voluptas incidunt harum nobis ad fuga, deserunt nihil
		totam perferendis porro ipsum fugit similique quod sapiente quasi culpa ullam
		ex vel iusto omnis!
	</p>
{:else}
	<i
		class="twa twa-fountain-pen absolute scale-150 self-center pt-[50%] text-9xl opacity-20"
	/>
{/if}
