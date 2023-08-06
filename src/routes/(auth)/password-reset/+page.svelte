<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	<div>
		<h4 class="text-center pt-2">Reset password</h4>
	</div>

	<div class="w-full">
		<form method="post" use:enhance class="w-full space-y-4">
			<div class="w-full">
				<label for="email" class="block pb-1 label">Email</label>
				<input
					class="input w-full"
					value={form?.email || ''}
					id="email"
					name="email"
					type="email"
					placeholder="Email account"
				/>
			</div>

			<button type="submit" class="btn variant-filled-primary w-full"> Send email </button>
		</form>
		{#if form?.message}
			<p class="pt-2 text-sm text-red-600">{form.message}</p>
		{/if}
		{#if form?.success}
			<p class="pt-2 text-lime-600">A verification email was sent to your inbox</p>
		{/if}
	</div>
</div>
