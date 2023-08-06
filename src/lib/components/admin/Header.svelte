<script>
	import { drawerStore, Avatar } from '@skeletonlabs/skeleton';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<header class="z-10 py-2 px-8 bg-white dark:bg-surface-800 items-center flex justify-between">
	<div>
		<button class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
			<span>
				<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
					<rect width="100" height="20" />
					<rect y="30" width="100" height="20" />
					<rect y="60" width="100" height="20" />
				</svg>
			</span>
		</button>
		<a href="/" class="text-lg permalink">{PUBLIC_APP_NAME}</a>
	</div>
	<Avatar src="" width="w-10" rounded="rounded-full" />
</header>
