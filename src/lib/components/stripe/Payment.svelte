<script lang="ts">
	import { onMount } from 'svelte';
	import { stripeClient, stripeElements } from '$lib/stores';
	import { loadStripe } from '$lib/client/stripe';
	import { error } from '@sveltejs/kit';
	import { dev } from '$app/environment';

	export let clientSecret: string;
	export let paymentOptions = {};
	let paymentContainer;

	let appearance = paymentOptions?.appearance || { theme: 'stripe' };

	// see all options available at
	// https://stripe.com/docs/js/elements_object/create_payment_element
	paymentOptions.layout = paymentOptions?.layout || 'tabs';

	let mounted = false;

	onMount(async () => {
		if (!clientSecret) return false;

		if (!$stripeClient) {
			try {
				await loadStripe();
			} catch (e) {
				if (dev) console.error(e);
				else throw error(500, 'Something went wrong');
			}
		}

		if (!$stripeElements) {
			try {
				$stripeElements = await $stripeClient.elements({ clientSecret, appearance });
			} catch (e) {
				if (dev) console.error(e);
				else throw error(500, 'Something went wrong');
			}
		}

		mounted = true;
		return () => {
			mounted = false;
		};
	});

	const paymentElement = (node) => {
		try {
			paymentContainer = $stripeElements.create('payment', paymentOptions);
			paymentContainer.mount(node);
		} catch (e) {
			if (dev) console.error(e);
			else throw error(500, 'Something went wrong');
		}
		return {
			destroy: () => {
				if (paymentContainer) paymentContainer.destroy();
				stripeClient.set(null);
				stripeElements.set(null);
			}
		};
	};
</script>

{#if mounted}
	<div use:paymentElement />
{/if}
