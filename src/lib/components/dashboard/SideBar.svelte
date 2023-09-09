<script lang="ts">
	import { getDrawerStore, LightSwitch, autoModeWatcher } from '@skeletonlabs/skeleton';

	import IconUsers from '~icons/tabler/users';
	import IconDashboard from '~icons/tabler/dashboard';

	import { page } from '$app/stores';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}

	$: activeUrl = $page.url;
	export let links = [
		{
			name: 'Dashboard',
			url: '/dashboard',
			icon: IconDashboard
		},
		{
			name: 'Users',
			url: '/dashboard/users',
			icon: IconUsers
		}
	];
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<nav class="list-nav grid h-full py-4">
	<ul>
		{#each links as link, a}
			<li class="relative">
				{#if activeUrl.pathname == link.url}
					<span
						class="bg-lime-600 absolute inset-y-0 left-0 w-1 rounded-tr-lg rounded-br-lg"
						aria-hidden="true"
					/>
				{/if}

				<a
					class="{activeUrl.pathname.startsWith(link.url)
						? ''
						: ''} inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-primary-800 dark:hover:text-primary-200 unstyled"
					href={link.url}
					on:click={drawerClose}
				>
					{#if link.icon}
						<svelte:component this={link.icon} class="w-6 h-6" />
					{/if}
					<span class="ml-4">{link.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	<div class="flex flex-col justify-end p-4">
		<LightSwitch rounded={'rounded-full'} />
	</div>
</nav>
