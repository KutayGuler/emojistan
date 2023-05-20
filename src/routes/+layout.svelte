<script>
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import Modal from './Modal.svelte';
	import { navigating } from '$app/stores';
	import Loading from './Loading.svelte';
</script>

<Toast />

<Modal />

<slot><!-- optional fallback --></slot>

{#if $navigating?.to?.url.pathname == '/editor' || $navigating?.from?.url.pathname == '/editor' || $navigating?.from?.route.id?.includes('(game)')}
	<Loading />
{/if}
