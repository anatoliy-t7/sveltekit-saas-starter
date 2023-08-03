<script lang="ts">
	import { clickOutside } from '$lib/client/utils';
	import IconChevronDown from '~icons/tabler/chevron-down';

	export let open: boolean = false;

	function toggle() {
		open = !open;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="relative" use:clickOutside on:click-outside={() => (open = false)}>
	<button on:click={() => toggle()} class="flex items-center gap-1">
		<slot name="trigger" />

		<IconChevronDown class="{open ? 'rotate-180' : ''} transition-all duration-300 w-4 h-4" />
	</button>

	{#if open}
		<div
			on:click={() => (open = false)}
			role="button"
			tabindex="0"
			class="absolute right-0 z-50 w-48 mt-2 transition duration-300 rounded-md shadow-lg"
		>
			<slot name="content" />
		</div>
	{/if}
</div>
