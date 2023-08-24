<script>
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import IconMenu from '~icons/tabler/menu-2';

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<header class="z-10 py-2 px-8 bg-white dark:bg-surface-800 items-center flex justify-between">
	<button class="md:hidden btn btn-sm" on:click={drawerOpen}>
		<IconMenu class="fill-token w-6 h-6" />
	</button>
	<a href="/" class="text-lg permalink">{PUBLIC_APP_NAME}</a>
</header>
