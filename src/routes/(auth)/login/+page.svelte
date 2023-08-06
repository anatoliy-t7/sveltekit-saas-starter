<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		taintedMessage: null
	});

	let message = 'You must be logged in to access this page';
	$: hasRedirect = $page.url.searchParams.get('redirectTo') ? true : false;
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	{#if hasRedirect}
		<p class="alert">{message}</p>
	{/if}

	<div class="text-center">
		<h2 class="text-2xl font-bold tracking-tight text-primary-900 unstyled">Sign In / Register</h2>
	</div>

	<div class="mt-6">
		<form method="POST" class="space-y-4" use:enhance>
			<label for="email" class="label">
				<span>Email address</span>
				<input
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					class="input"
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
				/>
				{#if $errors.email}
					<span class="text-sm text-red-600">
						{$errors.email}
					</span>
				{/if}
			</label>

			<label for="password" class="label">
				<span>Password</span>
				<input
					bind:value={$form.password}
					aria-invalid={$errors.password ? 'true' : undefined}
					class="input w-full"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
				{#if $errors.password}
					<span class="text-sm text-red-600">
						{$errors.password}
					</span>
				{/if}
			</label>

			<button type="submit" class="btn variant-filled-primary w-full"> Sign in </button>
		</form>

		<div class="flex items-center justify-end pt-2">
			<a href="/password-reset" class="text-sm hover:underline unstyled">Forgot your password?</a>
		</div>
	</div>
</div>
