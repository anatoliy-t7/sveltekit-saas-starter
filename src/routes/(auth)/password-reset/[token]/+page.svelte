<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	<div class="w-full">
		<form method="post" use:enhance class="w-full space-y-4">
			<label class="label">
				<span>New password</span>

				<input
					class="input w-full"
					id="new-password"
					name="new-password"
					type="text"
					placeholder="Type new password"
				/>
				<p class="text-xs italic">Password must be at least 8 characters long</p>
			</label>

			<button type="submit" class="btn variant-filled-primary w-full"> Reset password </button>
		</form>
		{#if form?.message}
			<p class="pt-2 text-red-600">{form.message}</p>
		{/if}
	</div>
</div>
