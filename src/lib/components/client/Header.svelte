<script>
	// @ts-nocheck
	import IconUserCircle from '~icons/tabler/user-circle';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Logo from '$lib/components/Logo.svelte';
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
	<nav class="dark:bg-slate-900 border-slate-100 bg-white border-b">
		<div class="flex items-center justify-between max-w-screen-xl px-4 mx-auto">
			<a href="/" class="flex items-center">
				<Logo class="sm:h-9 h-6" />
			</a>

			<div class="md:block md:w-auto hidden w-full" id="navbar-default">
				<ul
					class="md:items-center border-slate-100 bg-slate-50 md:flex-row md:space-x-8 md:border-0 md:bg-white dark:bg-slate-800 md:dark:bg-slate-900 dark:border-slate-700 flex flex-col p-4 border rounded-lg"
				>
					<li>
						<a
							href="/prices"
							class="permalink text-slate-700 hover:bg-slate-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-slate-400 md:dark:hover:text-white dark:hover:bg-slate-700 dark:hover:text-white md:dark:hover:bg-transparent block py-2 pl-3 pr-4 rounded"
							>Pricing</a
						>
					</li>

					{#if !data.user}
						<li>
							<a
								href="/login"
								class="permalink text-slate-700 hover:bg-slate-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-slate-400 md:dark:hover:text-white dark:hover:bg-slate-700 dark:hover:text-white md:dark:hover:bg-transparent block py-2 pl-3 pr-4 rounded"
								>Login</a
							>
						</li>
					{:else}
						<Dropdown>
							<div slot="trigger">
								<IconUserCircle class="dark:text-slate-100 text-slate-500 w-7 h-7" />
							</div>

							<div slot="content" class="bg-slate-50 grid gap-2 p-4 rounded-md">
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
