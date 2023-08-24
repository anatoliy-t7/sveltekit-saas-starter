<script lang="ts">
	import { page } from '$app/stores';
	$: active = (href: string) => (href === $page.url.pathname ? '!bg-primary-200' : '');
</script>

<main class="px-4 max-w-screen-xl mx-auto md:py-4">
	<div class="md:grid grid-cols-12 gap-6 flex flex-col">
		<div class="md:col-span-2 md:border-0 border-b">
			<nav class="list-nav">
				<ul>
					<li>
						<a href="/account" class="{active('/account')} "> Account </a>
					</li>
					<li>
						<a href="/account/billing" class="{active('/account/billing')} "> Billing </a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="col-span-10"><slot /></div>
	</div>
</main>
