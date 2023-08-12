<script>
	import { onMount } from 'svelte';

	export let publicKey;
	export let tableId;

	let loaded = false;
	let mounted = false;

	onMount(() => {
		mounted = true;
		return () => {
			mounted = false;
		};
	});

	function stripeCallback() {
		loaded = true;
	}
</script>

<svelte:head>
	{#if mounted}
		<script src="https://js.stripe.com/v3/pricing-table.js" on:load={stripeCallback} async></script>
	{/if}
</svelte:head>

{#if mounted && loaded}
	<stripe-pricing-table
		pricing-table-id={tableId}
		publishable-key={publicKey}
		client-reference-id="saas_test"
	></stripe-pricing-table>
{/if}
