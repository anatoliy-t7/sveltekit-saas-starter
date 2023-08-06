<script lang="ts">
	import { drawerStore, LightSwitch, autoModeWatcher } from '@skeletonlabs/skeleton';

	import IconUsers from '~icons/tabler/users';
	import IconDashboard from '~icons/tabler/dashboard';

	import { page } from '$app/stores';

	function drawerClose(): void {
		drawerStore.close();
	}

	$: activeUrl = $page.url;
	export let links = [
		{
			name: 'Dashboard',
			url: '/admin',
			icon: IconDashboard
		},
		{
			name: 'Users',
			url: '/admin/users',
			icon: IconUsers
		}
	];
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<nav class="list-nav py-4 grid h-full">
	<ul>
		{#each links as link, a}
			<li class="relative">
				{#if activeUrl.pathname == link.url}
					<span
						class="absolute inset-y-0 left-0 w-1 bg-lime-600 rounded-tr-lg rounded-br-lg"
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

	<div class="p-4 flex flex-col justify-end">
		<LightSwitch rounded={'rounded-full'} />
	</div>
</nav>
