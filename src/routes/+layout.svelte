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
	import Discover from './Discover.svelte';
	import Saves from './Saves.svelte';
	import { notifications } from './notifications';
	import {
		CONTROLLABLE_BORDER,
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
		{ href: '/tutorial/controls', background: '' },
		{ href: '/tutorial/ruleboxes', background: '' },
		{ href: '/tutorial/pusher', background: PUSHER_BORDER },
		{ href: '/tutorial/merger', background: MERGER_BORDER },
		{ href: '/tutorial/effector', background: EFFECTOR_BORDER },
		{ href: '/tutorial/controllable', background: CONTROLLABLE_BORDER },
		{ href: '/tutorial/interactable', background: INTERACTABLE_BORDER },
		{ href: '/tutorial/editor', background: '' },
	];
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
					<a
						{href}
						class="btn"
						style:background={href == $page.route.id ? background : ''}
						>{href.replace('/tutorial/', '')}</a
					>
				{/each}
			{:else if asideShowing == 'login'}
				<button
					class="btn w-full"
					on:click={() => {
						asideShowing = 'menu';
						// moveDown('login');
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
				<!-- class={asideShowing == 'menu' ? 'hidden' : 'w-full'} -->
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
					<!-- {#each up as key} -->
					<!-- in:receive={{ key }}
			out:send={{ key }} -->
					<button
						type="submit"
						class="btn-primary btn w-full {!resolved
							? 'pointer-events-none bg-transparent text-primary'
							: ''}"
						>{resolved ? 'LOGIN' : 'LOGGING IN' + dots[dotIndex]}</button
					>
					<!-- {/each} -->
				</form>
			{:else if asideShowing == 'signup'}
				<button
					class="btn w-full"
					on:click={() => {
						asideShowing = 'menu';
						// moveDown('login');
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
					<!-- {#each up as key} -->
					<!-- in:receive={{ key }}
		out:send={{ key }} -->
					<button
						type="submit"
						class="btn-primary btn w-full {!resolved
							? 'pointer-events-none bg-transparent text-primary'
							: ''}"
						>{resolved ? 'SIGN UP' : 'SIGNING UP' + dots[dotIndex]}</button
					>
					<!-- {/each} -->
				</form>
			{:else}
				<a href="/saves" class="btn-primary btn w-full">PLAY</a>
				<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
				<a href="/discover" class="btn-accent btn">DISCOVER</a>
			{/if}

			<div class="flex flex-grow" />
			{#if session}
				<!-- <div class="dropdown-bottom dropdown-end up-4 dropdown self-end">
					<button class="avatar">
						<div class="w-12 rounded-full ring ring-neutral-content">
							<img src="https://picsum.photos/200" alt="profile picture" />
						</div>
					</button>
					<ul
						tabindex="0"
						class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
					>
						<li><a href="/user/1">Profile</a></li>
						<li><a href="/account">Account</a></li>
						<li><a href="/">Logout</a></li>
					</ul>
				</div> -->
			{:else}
				<div class="flex w-full flex-col items-end gap-2 text-neutral-content">
					<!-- {#each down as key (key)} -->
					<!-- in:receive={{ key }}
		out:send={{ key }} -->
					<button
						class="btn-ghost btn-xs btn w-fit"
						on:click={() => {
							if (asideShowing == 'login') {
								asideShowing = 'menu';
							} else {
								asideShowing = 'login';
							}
							// moveUp(key);
						}}>Login</button
					>
					<!-- {/each} -->
					<button
						class="btn-ghost btn-xs btn w-fit"
						on:click={() => {
							if (asideShowing == 'signup') {
								asideShowing = 'menu';
							} else {
								asideShowing = 'signup';
							}
							// moveUp(key);
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
				<slot><!-- optional fallback --></slot>
			</div>
		{/if}
		<!-- {#if showing == 'discover'}
	<Discover />
{:else if showing == 'saves'}
	<Saves {emojiFreqs} />
{/if} -->
		<div class="up-2 absolute bottom-2">Emojistan v0.0.1</div>
	</main>
	<Background />
{:else}
	<slot />
{/if}

{#if $navigating && !$navigating.from?.route.id?.includes('tut')}
	<Loading />
{/if}

<Toast />

<!-- <slot /> -->

<Modal />

<style>
	aside {
		min-width: 384px;
	}
</style>
