<script lang="ts">
	import { enhance } from '$app/forms';
	import { notifications } from '$src/routes/notifications';
	import { fly } from 'svelte/transition';

	let resolved = true;

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

	let signedUp = false;
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if signedUp}
		<div in:fly class="text-neutral-content">
			<h1>Signup Successful!</h1>
			<p>Please check your email for confirmation.</p>
		</div>
	{:else}
		<form
			action="?/signup"
			method="POST"
			class="flex h-full w-1/2 flex-col items-start justify-center gap-2 pb-32"
			use:enhance={() => {
				resolved = false;
				showDots();

				return async ({ update, result }) => {
					await update();
					// @ts-expect-error
					if (result.data && result.data.error) {
						// @ts-expect-error
						notifications.warning(result.data.error);
					} else {
						signedUp = true;
					}

					resolved = true;
				};
			}}
		>
			<h3 class="pb-8 text-neutral-content">Sign Up</h3>
			<label class="pl-1 text-sm text-neutral-content" for="email">Email</label>
			<input
				required
				name="email"
				type="email"
				class="input-bordered input w-full"
			/>
			<label class="pl-1 text-sm text-neutral-content" for="password"
				>Password</label
			>
			<input
				minlength="8"
				maxlength="36"
				required
				name="password"
				type="password"
				class="input-bordered input w-full"
			/>
			<label class="pl-1 text-sm text-neutral-content" for="password"
				>Confirm password</label
			>
			<input
				minlength="8"
				maxlength="36"
				required
				name="passwordConfirm"
				type="password"
				class="input-bordered input w-full"
			/>
			<div class="form-control w-full">
				<label class="label cursor-pointer">
					<span class="label-text text-neutral-content"
						>I have read the <a class="link-primary link" href="/terms">Terms</a
						>
						and
						<a class="link-primary link" href="/privacy">Privacy</a></span
					>
					<input required type="checkbox" class="checkbox-primary checkbox" />
				</label>
			</div>
			<button
				type="submit"
				class="btn-primary btn w-full {!resolved
					? 'pointer-events-none bg-transparent text-primary'
					: ''}">{resolved ? 'SIGN UP' : 'SIGNING UP' + dots[dotIndex]}</button
			>
		</form>
	{/if}
</div>
