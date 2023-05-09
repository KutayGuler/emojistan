<script lang="ts">
	import '../app.css';
	import '../twemoji.css';
	import Toast from './Toast.svelte';
	import { navigating, page } from '$app/stores';
	import Modal from './Modal.svelte';
	import Loading from './Loading.svelte';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { fly } from 'svelte/transition';
	import Background from './Background.svelte';
	import { notifications } from './notifications';
	import {
		CONTROLLABLE_BORDER,
		CROSS,
		EFFECTOR_BORDER,
		INTERACTABLE_BORDER,
		MERGER_BORDER,
		PUSHER_BORDER,
	} from '$src/constants';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});

	let resolved = true;

	async function signUp() {
		if (password != confirmPassword) {
			notifications.warning('Passwords are not matching.');
			return;
		}

		resolved = false;
		showDots();

		supabase.auth
			.signUp({
				email,
				password,
			})
			.then((res) => {
				console.log(res.user);
				alert('signed up successfully! check your email!');
				asideShowing = 'menu';
				resolved = true;
			})
			.catch((err) => {
				console.error(err);
				resolved = true;
			});
	}

	async function signInWithGoogle() {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
		});
	}

	async function signInWithPassword() {
		resolved = false;
		showDots();

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		console.log(data, error);
		resolved = true;
		asideShowing = 'menu';
	}

	let email: string;
	let username: string;
	let password: string;
	let confirmPassword: string;

	let dots = ['...', '..', '.', ''];
	let dotIndex = 0;

	function showDots() {
		if (resolved) {
			return;
		}

		let timeout = setTimeout(() => {
			dotIndex = (dotIndex + 1) % dots.length;
			showDots();
			clearTimeout(timeout);
		}, 500);
	}

	let asideShowing = 'menu';
	let showing = 'menu';

	const tutorialLinks = [
		{ href: '/tutorial/controls', background: '#cfcfcf' },
		{ href: '/tutorial/ruleboxes', background: '' },
		{ href: '/tutorial/pusher', background: PUSHER_BORDER },
		{ href: '/tutorial/merger', background: MERGER_BORDER },
		{ href: '/tutorial/effector', background: EFFECTOR_BORDER },
		{ href: '/tutorial/controllable', background: CONTROLLABLE_BORDER },
		{ href: '/tutorial/interactable', background: INTERACTABLE_BORDER },
		{ href: '/tutorial/editor', background: '#ea5234' },
	];

	async function signOut() {
		const { error } = await supabase.auth.signOut();
	}
</script>

{#if $page.route.id != '/editor'}
	<main
		class="relative z-20 flex h-screen w-screen items-start justify-start gap-4 p-4"
	>
		<aside
			in:fly={{ x: -100 }}
			class="aside z-10 flex h-full w-96 flex-col gap-2 overflow-y-auto bg-neutral bg-opacity-95 shadow-xl"
		>
			{#if $page.route.id?.includes('tutorial')}
				<a class="btn" href="/"
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
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
				</a>
				{#each tutorialLinks as { href, background }}
					{@const isRulebox = href.includes('rule') && $page.route.id == href}
					<a
						{href}
						class="btn {isRulebox ? 'glass' : ''}"
						style:background={href == $page.route.id ? background : ''}
						>{href.replace('/tutorial/', '')}</a
					>
				{/each}
			{:else if asideShowing == 'login'}
				<button
					class="btn w-full"
					on:click={() => {
						asideShowing = 'menu';
					}}
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
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
				</button>
				<form
					class="flex flex-col gap-2"
					on:submit|preventDefault={signInWithPassword}
				>
					<h3 class="pt-8 text-neutral-content">Login</h3>
					<input
						required
						type="email"
						class="input-bordered input w-full"
						placeholder="email"
						bind:value={email}
					/>
					<input
						required
						type="password"
						class="input-bordered input w-full"
						placeholder="password"
						bind:value={password}
					/>
					<button
						type="submit"
						class="btn-primary btn w-full {!resolved
							? 'pointer-events-none bg-transparent text-primary'
							: ''}"
						>{resolved ? 'LOGIN' : 'LOGGING IN' + dots[dotIndex]}</button
					>
				</form>
			{:else if asideShowing == 'signup'}
				<button
					class="btn w-full"
					on:click={() => {
						asideShowing = 'menu';
					}}
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
							d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
						/>
					</svg>
				</button>
				<form class="flex flex-col gap-2" on:submit|preventDefault={signUp}>
					<h3 class="pt-8 text-neutral-content">Sign Up</h3>
					<input
						type="email"
						class="input-bordered input w-full"
						placeholder="email"
						bind:value={email}
					/>
					<input
						type="text"
						class="input-bordered input w-full"
						placeholder="user name"
						bind:value={username}
					/>
					<input
						type="password"
						class="input-bordered input w-full"
						placeholder="password"
						bind:value={password}
					/>
					<input
						type="password"
						class="input-bordered input w-full"
						placeholder="confirm password"
						bind:value={confirmPassword}
					/>
					<button
						type="submit"
						class="btn-primary btn w-full {!resolved
							? 'pointer-events-none bg-transparent text-primary'
							: ''}"
						>{resolved ? 'SIGN UP' : 'SIGNING UP' + dots[dotIndex]}</button
					>
				</form>
			{:else}
				<a href="/saves" class="btn-primary btn w-full">PLAY</a>
				<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
				<a href="/discover" class="btn-accent btn">DISCOVER</a>
			{/if}

			<div class="flex flex-grow" />
			{#if session}
				<div class="flex items-end justify-between">
					<button on:click={signOut} class="flex flex-row text-sm text-black"
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
								d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
							/>
						</svg>
						&nbsp; Logout</button
					>
					<a href="/profile/{session.user.id}" class="avatar self-end">
						<div class="w-12 rounded-full ring ring-neutral-content">
							<!-- svelte-ignore a11y-img-redundant-alt -->
							<img src="https://picsum.photos/200" alt="profile picture" />
						</div>
					</a>
				</div>
			{:else}
				<div class="flex w-full flex-col items-end gap-2 text-neutral-content">
					<button
						class="btn-ghost btn-xs btn w-fit"
						on:click={() => {
							if (asideShowing == 'login') {
								asideShowing = 'menu';
							} else {
								asideShowing = 'login';
							}
						}}>Login</button
					>
					<button
						class="btn-ghost btn-xs btn w-fit"
						on:click={() => {
							if (asideShowing == 'signup') {
								asideShowing = 'menu';
							} else {
								asideShowing = 'signup';
							}
						}}>Sign Up</button
					>
				</div>
			{/if}
		</aside>
		{#if $page.route.id == '/'}
			<slot><!-- optional fallback --></slot>
		{:else}
			<div
				in:fly={{ x: 100 }}
				class="z-10 h-full w-full rounded bg-base-200 bg-opacity-95 p-8"
			>
				<a
					href="/"
					class="btn-ghost btn absolute right-4 top-4 border-none text-2xl"
					>{CROSS}</a
				>
				<slot><!-- optional fallback --></slot>
			</div>
		{/if}
		<div class="absolute bottom-2 right-2">Emojistan v0.0.1</div>
	</main>
	<Background />
{:else}
	<slot />
{/if}

{#if $navigating && !$navigating.from?.route.id?.includes('tut')}
	<Loading />
{/if}

<Toast />

<Modal />

<style>
	aside {
		min-width: 384px;
	}
</style>
