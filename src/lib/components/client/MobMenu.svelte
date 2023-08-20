<script>
	import MainMenu from '$lib/components/client/MainMenu.svelte';
	export let user;
</script>

<div class=" md:block md:w-auto w-full transition-all duration-500 z-60 bg-blue-50 p-12">
	<MainMenu {user} />
</div>
