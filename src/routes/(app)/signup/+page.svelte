<script lang="ts">
	import { notifications } from '$src/routes/notifications';

	export let data;

	let resolved = true;

	let dots = ['...', '..', '.', ''];
	let dotIndex = 0;

	async function signUp() {
		if (password != confirmPassword) {
			notifications.warning('Passwords are not matching.');
			return;
		}

		resolved = false;
		showDots();

		data.supabase.auth
			.signUp({
				email,
				password,
			})
			.then((res) => {
				notifications.success('Signed up successfully! Check your email!');
				resolved = true;
			})
			.catch((err) => {
				notifications.success('An error occured');
				resolved = true;
			});
	}

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

	let email: string;
	let password: string;
	let confirmPassword: string;
	// TODO: agree to terms and services
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<form
		class="flex h-full w-1/2 flex-col items-start justify-center gap-2 pb-32"
		on:submit|preventDefault={signUp}
	>
		<h3 class="pb-8 text-neutral-content">Sign Up</h3>
		<label class="pl-1 text-sm text-neutral-content" for="email">Email</label>

		<input
			type="email"
			class="input-bordered input w-full"
			bind:value={email}
		/>
		<label class="pl-1 text-sm text-neutral-content" for="password"
			>Password</label
		>
		<input
			type="password"
			class="input-bordered input w-full"
			bind:value={password}
		/>
		<label class="pl-1 text-sm text-neutral-content" for="password"
			>Confirm password</label
		>
		<input
			type="password"
			class="input-bordered input w-full"
			bind:value={confirmPassword}
		/>
		<button
			type="submit"
			class="btn-primary btn w-full {!resolved
				? 'pointer-events-none bg-transparent text-primary'
				: ''}">{resolved ? 'SIGN UP' : 'SIGNING UP' + dots[dotIndex]}</button
		>
	</form>
</div>
