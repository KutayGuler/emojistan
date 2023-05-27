<script lang="ts">
	import { navigating, page } from '$app/stores';
	import type { LayoutData } from '../$types';
	import { fly } from 'svelte/transition';
	import Background from '../Background.svelte';
	import {
		CONTROLLABLE_BORDER,
		CROSS,
		EFFECTOR_BORDER,
		INTERACTABLE_BORDER,
		MERGER_BORDER,
		PUSHER_BORDER,
	} from '$src/constants';
	import { notifications } from '../notifications';
	import { enhance } from '$app/forms';

	export let data: LayoutData;
	let loggingOut = false;

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
</script>

<svelte:head>
	<meta
		name="description"
		content="Emojistan is a game platform and a pseudo game engine where you can make your own games and share them with the world."
	/>
	<meta
		name="keywords"
		content="emoji, free games, online games, building games, virtual worlds, game engine"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Emojistan" />
	<meta property="og:url" content="https://emojistan.app/" />
	<meta property="og:image" content="/images/cover.png" />
	<meta
		property="og:description"
		content="Emojistan is the place where emojis are interactive. Create emoji worlds to your own liking and share them with the world!"
	/>
</svelte:head>

<main
	class="relative flex h-screen w-screen items-start justify-start gap-4 p-4"
>
	<aside
		in:fly|local={{ x: -100 }}
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
				{@const loading = $navigating?.to?.url.pathname == href}
				{@const isRulebox =
					href.includes('rule') && $page.url.pathname.includes('rule')}
				<a
					class:loading
					{href}
					class="btn {isRulebox ? 'glass' : ''}"
					style:background={href == $page.url.pathname ? background : ''}
					>{href.replace('/tutorial/', '')}</a
				>
			{/each}
			<p class="text-warning">
				Tutorial is not up to date! New documentation will come soon.
			</p>
		{:else}
			<a
				href="/saves"
				class="btn-primary btn w-full {$navigating?.to?.url.pathname.includes(
					'saves'
				)
					? 'loading'
					: ''}">PLAY</a
			>
			<a
				href="/tutorial/controls"
				class="btn-secondary btn {$navigating?.to?.url.pathname.includes('tut')
					? 'loading'
					: ''}">TUTORIAL</a
			>
			<a
				href="/discover"
				class="btn-accent btn {$navigating?.to?.url.pathname.includes('disc')
					? 'loading'
					: ''}">DISCOVER</a
			>
		{/if}

		<div class="flex flex-grow" />
		{#if data.session}
			<div class="flex items-end justify-between">
				<form
					action="/logout"
					method="POST"
					use:enhance={() => {
						loggingOut = true;

						return async ({ update, result }) => {
							await update();

							// @ts-expect-error
							if (result.message) {
								// @ts-expect-error
								notifications.warning(result.message);
							}

							loggingOut = false;
						};
					}}
				>
					<button type="submit" class="flex flex-row text-sm text-black"
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
						&nbsp; {loggingOut ? 'Logging out...' : 'Logout'}</button
					>
				</form>
				<a
					href="/profile/{data.username || data.session.user.id}"
					class="avatar self-end {$navigating?.to?.url.pathname.includes(
						'profile'
					)
						? ''
						: ''}"
				>
					<i class="twa twa-alien text-4xl" />
				</a>
			</div>
		{:else}
			<div class="flex w-full flex-col items-end gap-2 text-neutral-content">
				<a href="/login" class="btn-ghost btn-xs btn w-fit">Login</a>
				<a href="/signup" class="btn-ghost btn-xs btn w-fit">Sign Up</a>
			</div>
		{/if}
		<div class="absolute bottom-0 left-1 text-xs text-base-300">
			Emojistan v0.0.1
		</div>
	</aside>
	{#if $page.route.id == '/(app)'}
		<slot />
	{:else}
		<div
			in:fly|local={{ x: 100 }}
			class="brutal z-10 h-full w-full rounded {['/signup', '/login'].includes(
				$page.url.pathname
			)
				? 'bg-neutral'
				: 'bg-base-200'} bg-opacity-95 p-8"
		>
			<a
				href="/"
				class="btn-ghost btn absolute right-4 top-4 border-none text-2xl hover:border-none"
				>{CROSS}</a
			>
			<slot><!-- optional fallback --></slot>
		</div>
	{/if}
</main>
<Background />

<style>
	aside {
		min-width: 384px;
	}
</style>
