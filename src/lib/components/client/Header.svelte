<script>
	// @ts-nocheck
	import { isMobile } from '$lib/client/utils';
	import Logo from '$lib/components/Logo.svelte';
	import MainMenu from '$lib/components/client/MainMenu.svelte';
	import IconMenu2 from '~icons/tabler/menu-2';
	import { drawerStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	export let duration = '500ms';
	export let offset = 0;
	export let tolerance = 0;
	export let data;

	let headerClass = 'pin';
	let lastHeaderClass = 'pin';
	let y = 0;
	let lastY = 0;

	const dispatch = createEventDispatcher();

	function deriveClass(y = 0, scrolled = 0) {
		if (y < offset) return 'pin';
		if (!scrolled || Math.abs(scrolled) < tolerance) return headerClass;
		const dir = scrolled < 0 ? 'down' : 'up';
		if (dir === 'up') return 'pin';
		if (dir === 'down') return 'unpin';
		return headerClass;
	}

	function updateClass(y = 0) {
		const scrolledPxs = lastY - y;
		const result = deriveClass(y, scrolledPxs);
		lastY = y;
		return result;
	}

	function action(node) {
		node.style.transitionDuration = duration;
	}

	$: {
		headerClass = updateClass(y);
		if (headerClass !== lastHeaderClass) {
			dispatch(headerClass);
		}
		lastHeaderClass = headerClass;
	}

	function drawerOpen() {
		drawerStore.open();
	}
</script>

<svelte:window bind:scrollY={y} />
<div use:action class="{headerClass} w-full top-0 transition-all z-30 duration-500 fixed">
	<nav class="dark:bg-slate-900 border-slate-100 border-b bg-white">
		<div class="flex items-center justify-between max-w-screen-xl p-4 mx-auto">
			<a href="/" class="flex items-center">
				<Logo />
			</a>

			{#if isMobile()}
				<button on:click={drawerOpen}>
					<IconMenu2 class="w-6 h-6" />
				</button>
			{:else}
				<MainMenu user={data.user} />
			{/if}
		</div>
	</nav>
</div>

<style>
	.pin {
		transform: translateY(0%);
	}

	.unpin {
		transform: translateY(-100%);
	}
</style>
