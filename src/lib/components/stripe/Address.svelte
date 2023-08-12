<script>
	import { onMount } from 'svelte';
	import { stripeClient, stripeElements } from '$lib/stores';
	import { loadStripe } from '$lib/client/stripe';
	import { error } from '@sveltejs/kit';
	import { dev } from '$app/environment';

	export let clientSecret;
	export let addressOptions = {};
	export let addressContainer;

	let appearance = addressOptions.appearance || { theme: 'stripe' };

	// see all options available at
	// https://stripe.com/docs/js/elements_object/create_address_element
	addressOptions.mode = addressOptions.mode || 'shipping';
	addressOptions.autocomplete = addressOptions.autocomplete || { mode: 'automatic' };
	addressOptions.allowedCountries = addressOptions.allowedCountries || ['US'];
	addressOptions.blockPoBox = addressOptions.blockPoBox || false;
	addressOptions.contacts = addressOptions.contacts || [];
	addressOptions.defaultValues = addressOptions.defaultValues || {};
	addressOptions.fields = addressOptions.fields || { phone: 'always' };
	addressOptions.validation = addressOptions.validation || { phone: { required: 'never' } };
	addressOptions.display = addressOptions.display || { name: 'split' };

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

	const addressElement = (node) => {
		try {
			addressContainer = $stripeElements.create('address', addressOptions);
			addressContainer.mount(node);
		} catch (e) {
			if (dev) console.error(e);
			else throw error(500, 'Something went wrong');
		}
		return {
			destroy: () => {
				if (addressContainer) addressContainer.destroy();
				stripeClient.set(null);
				stripeElements.set(null);
			}
		};
	};
</script>

{#if mounted}
	<div use:addressElement />
{/if}
