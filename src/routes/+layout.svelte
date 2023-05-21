<script lang="ts">
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import Modal from './Modal.svelte';
	import { navigating } from '$app/stores';
	import Loading from './Loading.svelte';
	import type { LayoutData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { notifications } from './notifications';

	export let data: LayoutData;

	$: ({ supabase, session, username } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				console.log(data);
				// invalidate('supabase:auth');
				invalidateAll();
				notifications.success('Logged in as ' + username);
				// goto('/');
				console.log('invalidate');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<Toast />

<Modal />

<slot><!-- optional fallback --></slot>

{#if $navigating?.to?.url.pathname == '/editor' || $navigating?.from?.url.pathname == '/editor' || $navigating?.from?.route.id?.includes('(game)')}
	<Loading />
{/if}
