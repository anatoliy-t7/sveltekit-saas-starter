<script>
	import { PUBLIC_STRIPE_KEY, PUBLIC_STRIPE_TABLE_ID } from '$env/static/public';
	import PricingTable from '$lib/components/stripe/PricingTable.svelte';
</script>

<PricingTable publicKey={PUBLIC_STRIPE_KEY} tableId={PUBLIC_STRIPE_TABLE_ID} />
