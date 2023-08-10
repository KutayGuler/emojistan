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
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	export let data: LayoutData;

	$: ({ supabase, session, username } = data);

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					// uncomment following code if you want check for updates
					// r && setInterval(() => {
					//    console.log('Checking for sw update')
					//    r.update()
					// }, 20000 /* 20s for testing purposes */)
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				},
			});
		}

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
	{@html webManifest}
</svelte:head>

<Toast />

<Modal />

<slot><!-- optional fallback --></slot>

{#if $navigating?.to?.url.pathname == '/editor' || $navigating?.from?.url.pathname == '/editor' || $navigating?.from?.route.id?.includes('(game)')}
	<Loading />
{/if}

{#await import('./ReloadPrompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
