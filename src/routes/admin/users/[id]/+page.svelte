<script lang="ts">
	import IconChevronLeft from '~icons/tabler/chevron-left';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import Error from '$lib/components/Error.svelte';
	import { goto } from '$app/navigation';
	export let data;
	const { form, errors, enhance, constraints, message } = superForm(data.form, {
		dataType: 'json',
		onResult({ result }) {
			if (result.type === 'redirect') {
				goto(result.location);
			}
		}
	});
</script>

<svelte:head>
	{#if $form.id}
		<title>Edit user</title>
	{:else}
		<title>Add new user</title>
	{/if}
</svelte:head>

<main>
	<div class="max-w-screen-md flex gap-6 items-center">
		<a href="/admin/users" class="hover p-1">
			<IconChevronLeft class="dark:text-primary-100" />
		</a>
		<h3 class="my-6 text-2xl font-semibold text-primary-700 dark:text-primary-200">
			{#if $form.id}
				Edit user
			{:else}
				Add new user
			{/if}
		</h3>
	</div>

	<div class="flex gap-6 max-w-screen-md">
		<form method="POST" action="?/save" use:enhance>
			<input type="hidden" name="id" value={$form.id} />
			<div class="flex gap-6">
				<div class="grid gap-6 grid-cols-2">
					<label class="label">
						<span>Name</span>
						<input
							class="input"
							type="text"
							bind:value={$form.name}
							aria-invalid={$errors.name ? 'true' : undefined}
							{...$constraints.name}
							class:input-error={$errors.name}
							name="name"
							placeholder="user name"
						/>
						{#if $errors.name}
							<Error>{$errors.name}</Error>
						{/if}
					</label>

					<label class="label">
						<span>Email</span>
						<input
							class="input"
							bind:value={$form.email}
							aria-invalid={$errors.email ? 'true' : undefined}
							{...$constraints.email}
							class:input-error={$errors.email}
							name="email"
							type="email"
							placeholder="email"
						/>
						{#if $errors.email}
							<Error>{$errors.email}</Error>
						{/if}
					</label>

					{#if !$form.id}
						<label class="label">
							<span>Password</span>
							<input
								class="input"
								bind:value={$form.password}
								aria-invalid={$errors.password ? 'true' : undefined}
								{...$constraints.password}
								class:input-error={$errors.password}
								name="password"
								type="password"
								placeholder="password"
							/>
							{#if $errors.password}
								<Error>{$errors.password}</Error>
							{/if}
						</label>
					{/if}

					<label class="label">
						<span>Role</span>
						<select
							class="select"
							bind:value={$form.role}
							aria-invalid={$errors.role ? 'true' : undefined}
							{...$constraints.role}
							class:input-error={$errors.role}
							name="role"
						>
							{#each data.roles as role}
								<option value={role.value}>{role.name}</option>
							{/each}
						</select>

						{#if $errors.role}
							<Error>{$errors.role}</Error>
						{/if}
					</label>

					<div class="pt-8">
						<SlideToggle name="active" bind:checked={$form.active} active="bg-primary-500">
							Active
						</SlideToggle>
					</div>
				</div>
			</div>
			<div class="pt-6 flex justify-between">
				<button type="submit" class="btn variant-filled">
					{#if $form.id}
						Save
					{:else}
						Create
					{/if}
				</button>
				{#if $form.id}
					<form action="?/delete" method="POST" use:enhance>
						<input type="hidden" name="id" bind:value={$form.id} />
						<button
							on:click={(e) => !confirm('Are you sure?') && e.preventDefault()}
							type="submit"
							class="btn variant-filled-error">Delete</button
						>
					</form>
				{/if}
			</div>
		</form>
	</div>
</main>
