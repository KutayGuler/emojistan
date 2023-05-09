<script lang="ts">
	import supabase from '$api/supabase';
	import {
		map,
		pushers,
		mergers,
		interactables,
		effectors,
		dialogueTree as dialogue,
		controllables,
		saves,
	} from '../store';
	import { rbxStore } from '$lib/stores/store';
	import Saves from './Saves.svelte';
	import { onMount } from 'svelte';
	import Background from './Background.svelte';
	import Discover from './Discover.svelte';
	import { fly } from 'svelte/transition';
	import { notifications } from './notifications';
	export let emojiFreqs = new Map<string, Set<string>>();

	onMount(() => {
		if ($saves.currentSaveID === '') saves.useStorage();
		for (let [saveID, _] of $saves.saves) {
			let items = JSON.parse(localStorage.getItem(saveID + '_items') as string);
			let set = new Set<string>(
				items.map(([key, val]: [string, string]) => val)
			);
			while (set.size > 8) {
				set.delete(set.values().next().value);
			}
			emojiFreqs.set(saveID, set);
		}
	});

	// let showSaves = false;
	// let showDiscover = false;
	let showing: 'saves' | 'discover' | '' = '';
	let asideShowing: 'menu' | 'login' | 'signup' = 'menu';

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
	}

	async function addIsland() {
		let owner = await supabase.auth.getUser();
		if (!owner.data.user) {
			return;
		}

		// CF #8
		const { data, error } = await supabase.from('games').insert([
			{
				data: {
					map: {
						items: Object.fromEntries($map.items),
						backgrounds: Object.fromEntries($map.backgrounds),
					},
					rbxs: Array.from($rbxStore),
					pushers: Object.fromEntries($pushers),
					mergers: Object.fromEntries($mergers),
					effectors: Object.fromEntries($effectors),
					interactables: Object.fromEntries($interactables),
					controllables: Object.fromEntries($controllables),
					dialogueTree: Object.fromEntries($dialogue),
				},
				owner: owner.data.user.id,
			},
		]);
	}

	async function getgames() {
		let user = await supabase.auth.getUser();
		let { data: games, error } = await supabase
			.from('games')
			.select('data')
			.eq('owner', user.data.user?.id);
	}

	let resolved = true;

	async function signUp() {
		resolved = false;
		showDots();

		setTimeout(() => {
			resolved = true;
		}, 5000);

		return;

		if (password != confirmPassword) {
			notifications.warning('Passwords are not matching.');
			return;
		}

		resolved = false;

		supabase.auth
			.signUp({
				email,
				password,
			})
			.then((res) => {
				console.log(res.user);
				alert('signed up successfully! check your email!');
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

	// const [send, receive] = crossfade({
	// 	duration: (d) => Math.sqrt(d * 200),

	// 	fallback(node, params) {
	// 		const style = getComputedStyle(node);
	// 		const transform = style.transform === 'none' ? '' : style.transform;

	// 		return {
	// 			duration: 600,
	// 			easing: quintOut,
	// 			css: (t) => `
	// 				transform: ${transform} scale(${t});
	// 				opacity: ${t}
	// 			`,
	// 		};
	// 	},
	// });

	let up: Array<'login'> = [];
	let down: Array<'login'> = ['login'];
	let transitioning = false;

	// function move(item: 'login', from: Array<'login'>, to: Array<'login'>) {
	// 	to.push(item);
	// 	return [[], to];
	// }

	// function moveUp(item: 'login') {
	// 	[down, up] = move(item, down, up);
	// 	console.log(up, down);
	// }

	// function moveDown(item: 'login') {
	// 	[up, down] = move(item, up, down);
	// }
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>

<main
	class="relative z-20 flex h-screen w-screen items-start justify-start gap-4 p-4"
>
	<!-- <div class="dropdown dropdown-bottom dropdown-end absolute up-4 top-4">
		<button class="avatar ">
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
	<aside
		in:fly={{ x: -100 }}
		class="aside z-10 flex h-full w-96 flex-col gap-2 overflow-y-auto bg-neutral bg-opacity-95 shadow-xl"
	>
		{#if asideShowing == 'menu'}
			<button
				on:click={() => {
					if (showing == 'saves') {
						showing = '';
					} else {
						showing = 'saves';
					}
				}}
				class="btn-primary btn w-full">PLAY</button
			>
			<a href="/tutorial/controls" class="btn-secondary btn">TUTORIAL</a>
			<button
				on:click={() => {
					if (showing == 'discover') {
						showing = '';
					} else {
						showing = 'discover';
					}
				}}
				class="btn-accent btn">DISCOVER</button
			>
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
						: ''}">{resolved ? 'LOGIN' : 'LOGGING IN' + dots[dotIndex]}</button
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
		{/if}

		<div class="flex flex-grow" />
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
	</aside>
	{#if showing == 'discover'}
		<Discover />
	{:else if showing == 'saves'}
		<Saves {emojiFreqs} />
	{/if}
	<div class="up-2 absolute bottom-2">Emojistan v0.0.1</div>
</main>
<Background />
