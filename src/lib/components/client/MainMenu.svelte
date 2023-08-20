<script>
	import IconUserCircle from '~icons/tabler/user-circle';
	import { isMobile } from '$lib/client/utils';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import { drawerStore } from '@skeletonlabs/skeleton';
	export let user;

	function drawerClose() {
		if (isMobile()) {
			drawerStore.close();
		}
	}
</script>

<ul class="md:items-center md:flex-row flex flex-col gap-4">
	<li>
		<a
			on:click={drawerClose}
			href="/pricing"
			class="permalink text-slate-700 hover:text-blue-700 block px-2">Pricing</a
		>
	</li>

	{#if !user}
		<li>
			<a
				on:click={drawerClose}
				href="/login"
				class="permalink text-slate-700 hover:text-blue-700 block px-2">Sign In/Up</a
			>
		</li>
	{:else}
		<Dropdown>
			<div slot="trigger" class="px-2">
				<IconUserCircle class=" text-slate-500 w-7 h-7 hover:text-blue-700" />
			</div>

			<div slot="content" class="grid gap-2 p-4 rounded-md">
				<a on:click={drawerClose} href="/account" class="hover:underline permalink">Account</a>

				{#if user.role !== 'client'}
					<a href="/admin" class="hover:underline permalink"> Dashboard</a>
				{/if}

				<a
					on:click={drawerClose}
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
