<script lang="ts">
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import Modal from './Modal.svelte';
	import { navigating } from '$app/stores';
	import Loading from './Loading.svelte';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import { notifications } from './notifications';
	import { invalidate, invalidateAll } from '$app/navigation';

	export let data: LayoutData;

	$: ({ supabase, session, username } = data);

	onMount(async () => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				// invalidate('supabase:auth'); // huntabyte: invalidateAll()
				invalidateAll();
				if (username) {
					notifications.success('Logged in as ' + username);
				}
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<svelte:head>
	<script
		defer
		data-domain="emojistan.app"
		src="https://plausible.io/js/script.js"
	></script>
</svelte:head>

<Toast />

<Modal />

<slot><!-- optional fallback --></slot>

{#if $navigating?.to?.url.pathname == '/editor' || $navigating?.from?.url.pathname == '/editor' || $navigating?.from?.route.id?.includes('(game)')}
	<Loading />
{/if}
