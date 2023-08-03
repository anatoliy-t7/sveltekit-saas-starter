<script>
	import IconUserCircle from '~icons/tabler/user-circle';
	import Dropdown from '$lib/components/Dropdown.svelte';

	// import Logo from '$lib/components/Logo.svelte';
	import { createEventDispatcher } from 'svelte';

	export let duration = '500ms';
	export let offset = 0;
	export let tolerance = 0;
	/**
	 * @type {{ user: { role: string; }; }}
	 */
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

	/**
	 * @param {HTMLDivElement} node
	 */
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
</script>

<svelte:window bind:scrollY={y} />
<div use:action class="{headerClass} fixed w-full top-0 transition-all z-50">
	<nav class="dark:bg-primary-900 border-primary-100 bg-white border-b">
		<div class="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
			<a href="/" class="flex items-center">
				<!-- <Logo class="sm:h-9 h-6" /> -->
			</a>
			<button
				data-collapse-toggle="navbar-default"
				type="button"
				class="text-primary-500 md:hidden hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:text-primary-400 dark:hover:bg-primary-700 dark:focus:ring-primary-600 inline-flex items-center p-2 ml-3 text-sm rounded-lg"
				aria-controls="navbar-default"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>

			<div class="md:block md:w-auto hidden w-full" id="navbar-default">
				<ul
					class="md:items-center border-primary-100 bg-primary-50 md:flex-row md:space-x-8 md:border-0 md:bg-white dark:bg-primary-800 md:dark:bg-primary-900 dark:border-primary-700 flex flex-col p-4 border rounded-lg"
				>
					{#if !data.user}
						<li>
							<a
								href="/login"
								class="permalink text-primary-700 hover:bg-primary-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-primary-400 md:dark:hover:text-white dark:hover:bg-primary-700 dark:hover:text-white md:dark:hover:bg-transparent block py-2 pl-3 pr-4 rounded"
								>Login</a
							>
						</li>
					{:else}
						<Dropdown>
							<div slot="trigger">
								<IconUserCircle class="dark:text-primary-100 text-primary-500 w-8 h-8" />
							</div>

							<div slot="content" class="bg-primary-50 grid gap-2 p-4 rounded-md">
								<a href="/account" class="hover:underline permalink">Account</a>

								{#if data.user.role !== 'client'}
									<a href="/admin" class="hover:underline permalink"> Dashboard</a>
								{/if}

								<a
									data-sveltekit-preload-data="off"
									href="/logout"
									class="hover:underline permalink"
								>
									Logout</a
								>
							</div>
						</Dropdown>
					{/if}
				</ul>
			</div>
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
