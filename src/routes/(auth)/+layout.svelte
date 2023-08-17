<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	const img = '/img/error.webp';
</script>

<div class="flex w-full max-h-screen min-h-screen">
	<div class="lg:w-6/12 relative flex items-center justify-center w-full min-h-screen bg-white">
		<div class="flex justify-center flex-col px-4 space-y-6">
			<a href="/" class="absolute top-12 left-12">
				<Logo size={'w-8 h-8'} />
			</a>

			<slot />
		</div>
	</div>
	<div class="lg:flex lg:w-6/12 bg-lime-100 hidden min-h-screen overflow-hidden">
		<img class="object-cover object-bottom w-full" src={img} alt="sign in" />
	</div>
</div>
