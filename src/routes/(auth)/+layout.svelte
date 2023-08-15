<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
</script>

<div class="flex w-full max-h-screen min-h-screen">
	<div class="lg:w-6/12 relative flex items-center justify-center w-full min-h-screen bg-white">
		<div class="flex justify-center flex-col px-4 space-y-6">
			<a href="/" class="flex items-center justify-center">
				<Logo />
			</a>

			<slot />
		</div>
	</div>
	<div class="lg:flex lg:w-6/12 bg-lime-100 hidden min-h-screen overflow-hidden">
		<!-- <img class="object-cover object-bottom w-full" src="/img/auth-bg.webp" alt="image" /> -->
	</div>
</div>
