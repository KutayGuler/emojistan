<script>
	import Toast from './Toast.svelte';
	import { navigating } from '$app/stores';
	import '../app.css';
	import '../twemoji.css';
	import supabase from '../supabase';
	import Modal from './Modal.svelte';
	import { showLoading } from '$src/store';

	supabase.auth.onAuthStateChange((event, session) => {});
</script>

{#if $showLoading || ($navigating?.from?.route.id == '/' && $navigating?.to?.route.id == '/editor')}
	<div
		class="absolute z-20 flex h-full w-full items-center justify-center bg-white text-2xl"
	>
		LOADING
		<span class="px-2" id="loading">👾</span>
	</div>
{/if}

<Toast />

<slot />

<Modal />

<style>
	@keyframes idle {
		100% {
			transform: translateY(-20px);
		}
	}

	#loading {
		animation: idle 300ms ease-out infinite alternate;
	}
</style>
