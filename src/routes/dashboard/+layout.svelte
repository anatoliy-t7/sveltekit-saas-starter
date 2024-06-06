<script lang="ts">
	import SideBar from '$lib/components/dashboard/SideBar.svelte';
	import Header from '$lib/components/dashboard/Header.svelte';
	import { fade } from 'svelte/transition';
	export let data;
	import { AppShell, Drawer, Modal, Toast } from '@skeletonlabs/skeleton';
</script>

<Toast />
<Modal />
<Drawer>
	<SideBar />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10">
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBar />
	</svelte:fragment>

	{#key data.url}
		<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
			<div class="container p-4 py-6 mx-auto">
				<slot />
			</div>
		</div>
	{/key}
</AppShell>
