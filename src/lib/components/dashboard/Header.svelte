<script>
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import IconMenu from '~icons/tabler/menu-2';
	const drawerStore = getDrawerStore();

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<header class="dark:bg-surface-800 z-10 flex items-center justify-between px-8 py-2 bg-white">
	<button class="md:hidden btn btn-sm" on:click={drawerOpen}>
		<IconMenu class="fill-token w-6 h-6" />
	</button>
	<a href="/" class="permalink text-lg">{PUBLIC_APP_NAME}</a>
</header>
