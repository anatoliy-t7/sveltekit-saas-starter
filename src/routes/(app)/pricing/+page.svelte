<script>
	export let data;
	import { PUBLIC_STRIPE_KEY, PUBLIC_STRIPE_TABLE_ID } from '$env/static/public';
	import PricingTable from '$lib/components/stripe/PricingTable.svelte';
</script>

<main class="max-w-screen-xl px-4 mx-auto">
	<div class="pb-24 text-center">
		{#if data.product}
			<div>You subscribed to <b> {data.product.name}</b> plan</div>
		{/if}
	</div>
	<PricingTable publicKey={PUBLIC_STRIPE_KEY} tableId={PUBLIC_STRIPE_TABLE_ID} />
</main>
