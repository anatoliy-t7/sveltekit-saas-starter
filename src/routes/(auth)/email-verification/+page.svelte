<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let form;
	export let data;
	console.log('data', data);
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	<div class="flex flex-col items-center justify-center">
		{#if data.success}
			<div class="pt-2 text-lime-600">Your email was verified.</div>
		{:else}
			<form method="POST" class="space-y-6" use:enhance>
				<div>
					<button type="submit" class="btn variant-filled-primary">
						Send new verification link
					</button>
				</div>
			</form>
		{/if}

		{#if form?.success}
			<div class="pt-2 text-lime-600">We sent you new verification link to your email.</div>
		{/if}
		{#if $page.error}
			<div class="pt-2 text-red-600">{$page.error.message}</div>
		{/if}
	</div>
</div>
