<script lang="ts">
	import { enhance } from '$app/forms';
	import { notifications } from '$src/routes/notifications';
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
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	<form
		action="?/login"
		method="POST"
		class="form-control flex h-full w-1/2 flex-col items-start justify-center gap-2 pb-32"
		use:enhance={() => {
			resolved = false;
			showDots();

			return async ({ update, result }) => {
				await update();
				// @ts-expect-error
				if (result.data && result.data.error) {
					// @ts-expect-error
					notifications.warning(result.data.error);
				}

				resolved = true;
			};
		}}
	>
		<h3 class="pb-8 text-neutral-content">Login</h3>
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
			required
			name="password"
			type="password"
			class="input-bordered input w-full"
		/>
		<button
			type="submit"
			class="btn-primary btn w-full {!resolved
				? 'pointer-events-none bg-transparent text-primary'
				: ''}">{resolved ? 'LOGIN' : 'LOGGING IN' + dots[dotIndex]}</button
		>
	</form>
</div>
