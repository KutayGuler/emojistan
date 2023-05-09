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
	import type { PageData } from './$types';
	let emojiFreqs = new Map<string, Set<string>>();

	export let data: PageData;

	// let showSaves = false;
	// let showDiscover = false;
	let showing: 'saves' | 'discover' | '' = '';
	let asideShowing: 'menu' | 'login' | 'signup' | 'tutorial' = 'menu';

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
	$: console.log(data);
</script>

<svelte:head>
	<title>Emojistan</title>
</svelte:head>
