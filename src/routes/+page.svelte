<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: console.log(data);
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>
