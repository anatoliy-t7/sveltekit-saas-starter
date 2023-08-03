<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import Helper from '$lib/components/Helper.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	export let data;
	const { form, errors, enhance, constraints, message } = superForm(data.form);

	$: if ($message) {
		toastStore.trigger($message);
	}
</script>

<svelte:head>
	<title>My account - {PUBLIC_APP_NAME}</title>
</svelte:head>

<main class="px-4 max-w-screen-xl mx-auto space-y-2">
	<h4>My account</h4>

	<form method="POST" action="?/save" use:enhance>
		<input type="hidden" name="id" value={$form.id} />
		<div class="space-y-4 max-w-xs">
			<label class="label">
				<span>Name</span>
				<input
					class="input"
					type="text"
					id="name"
					name="name"
					placeholder="user name"
					bind:value={$form.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					{...$constraints.name}
				/>
				{#if $errors.name}
					<Helper>{$errors.name}</Helper>
				{/if}
			</label>

			<label class="label">
				<span>Email</span>
				<input
					class="input"
					id="email"
					name="email"
					type="email"
					placeholder="email"
					required
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					{...$constraints.email}
				/>
				{#if $errors.email}
					<Helper>{$errors.email}</Helper>
				{/if}
			</label>

			<label class="label">
				<span>Phone</span>
				<input
					class="input"
					id="phone"
					name="phone"
					type="tel"
					placeholder="Phone"
					bind:value={$form.phone}
					aria-invalid={$errors.phone ? 'true' : undefined}
					{...$constraints.phone}
				/>
				{#if $errors.phone}
					<Helper>{$errors.phone}</Helper>
				{/if}
			</label>

			<div class="flex justify-end">
				<button type="submit" class="btn variant-filled-primary"> Save </button>
			</div>
		</div>
	</form>

	<div>
		<a href="/password-reset">Reset password</a>
	</div>
</main>
