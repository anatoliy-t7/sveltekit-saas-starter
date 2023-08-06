<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	export let pagination: object;
	export let url: string;
	const pages = new Array(pagination.pageCount).fill(0);

	async function gotoPage(p: string) {
		$page.url.searchParams.delete('page');
		$page.url.searchParams.set('page', p);
		url = `${url}?${$page.url.searchParams.toString()}`;
		console.log(url);
		await goto(url);
		await invalidateAll();
	}
</script>

{#if pagination.pageCount > 1}
	<nav aria-label="Page navigation" class="pt-4">
		<ul class="inline-flex -space-x-px items-center">
			<li>
				{#if pagination.previousPage}
					<a
						href={url + `?page=${pagination.previousPage}`}
						class="block py-2 px-3 text-sm font-medium border border-primary-300 text-primary-500 bg-white hover:bg-primary-100 hover:text-primary-700 dark:bg-primary-800 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-700 dark:hover:text-white rounded-l-lg unstyled"
						>Previous</a
					>
				{:else}
					<button
						disabled
						class="block py-2 px-3 text-sm font-medium border border-primary-300 text-primary-500 bg-white disabled:cursor-not-allowed dark:bg-primary-800 dark:border-primary-700 dark:text-primary-400 rounded-l-lg unstyled"
						>Previous</button
					>
				{/if}
			</li>

			{#each pages as count, index}
				<li>
					<button
						on:click={() => gotoPage(index + 1)}
						class="{pagination.currentPage == `${index + 1}`
							? 'dark:bg-primary-700 bg-primary-100'
							: 'dark:bg-primary-800 bg-white'} block py-2 px-3 text-sm font-medium border border-primary-300 text-primary-500 hover:bg-primary-100 hover:text-primary-700 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-700 dark:hover:text-white unstyled"
					>
						{index + 1}
					</button>
				</li>
			{/each}

			<li>
				{#if pagination.nextPage}
					<a
						href={url + `?page=${pagination.nextPage}`}
						class="block py-2 px-3 text-sm font-medium border border-primary-300 text-primary-500 bg-white hover:bg-primary-100 hover:text-primary-700 dark:bg-primary-800 dark:border-primary-700 dark:text-primary-400 dark:hover:bg-primary-700 dark:hover:text-white rounded-r-lg unstyled"
					>
						Next
					</a>
				{:else}
					<button
						disabled
						class="block py-2 px-3 text-sm font-medium border border-primary-300 text-primary-500 bg-white disabled:cursor-not-allowed dark:bg-primary-800 dark:border-primary-700 dark:text-primary-400 rounded-r-lg unstyled"
						>Next</button
					>
				{/if}
			</li>
		</ul>
	</nav>
{/if}
