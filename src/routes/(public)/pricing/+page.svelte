<script lang="ts">
	import { goto } from '$app/navigation';
	import Plan from '$lib/components/Plan.svelte';
	export let data;

	function choose(plan: Plan) {
		if (data.user) {
			goto(`/checkout?plan=${plan.handle}`);
		} else {
			goto(`/login?plan=${plan.handle}`);
		}
	}
</script>

<main class="max-w-screen-xl px-4 mx-auto">
	{#each data.plans as plan}
		<Plan {plan} />
		<article>
			<h2>{plan.name}</h2>

			<p>{(plan.price / 100).toLocaleString('en', { style: 'currency', currency: 'usd' })}</p>

			<button on:click|preventDefault={() => choose(plan)}>Choose</button>
		</article>
	{/each}
</main>
