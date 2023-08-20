<script lang="ts">
	import { page } from '$app/stores';
	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-200' : '');
</script>

<main class="px-4 max-w-screen-xl mx-auto py-4">
	<div class="grid grid-cols-12 gap-6">
		<div class="col-span-2">
			<nav class="list-nav">
				<ul>
					<li>
						<a href="/account" class="{classesActive('/account')} "> Account </a>
					</li>
					<li>
						<a href="/account/billing" class="{classesActive('/account/billing')} "> Billing </a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="col-span-10"><slot /></div>
	</div>
</main>
