<script lang="ts">
	import Header from '$lib/components/client/Header.svelte';
	import Footer from '$lib/components/client/Footer.svelte';
	import { fade } from 'svelte/transition';
	import { Drawer } from '@skeletonlabs/skeleton';
	import MobMenu from '$lib/components/client/MobMenu.svelte';
	export let data;
</script>

<Drawer duration={500} bgDrawer={'bg-blue-50'} rounded={'rounded-none'}>
	<MobMenu user={data.user} />
</Drawer>

<Header bind:data />

{#key data.url}
	<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
		<div class="py-24">
			<slot />
		</div>
	</div>
{/key}

<Footer />
