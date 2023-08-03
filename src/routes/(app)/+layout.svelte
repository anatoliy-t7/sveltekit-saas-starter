<script lang="ts">
	import Header from '$lib/components/client/Header.svelte';
	import Footer from '$lib/components/client/Footer.svelte';
	import { fade } from 'svelte/transition';

	export let data;
</script>

<Header bind:data />

{#key data.url}
	<div in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
		<div class="py-24">
			<slot />
		</div>
	</div>
{/key}

<Footer />
