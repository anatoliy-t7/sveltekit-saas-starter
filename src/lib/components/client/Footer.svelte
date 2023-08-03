<script lang="ts">
	// import Logo from '$lib/components/Logo.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
</script>

<footer class="border-primary-50 py-12 border-t-8">
	<div class="max-w-screen-xl px-4 mx-auto">
		<div class="sm:grid-cols-3 lg:grid-cols-4 grid grid-cols-2 gap-6 mb-10">
			<div>
				<a href="/">
					<!-- <Logo class="h-12" /> -->
				</a>
			</div>
			<!--
			<div>
				<h4 class="text-primary-900 dark:text-primary-100 font-semibold">Shop</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/">Soap</a
					>
					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/">Category</a
					>
					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/">Category</a
					>
				</div>
			</div>

			<div>
				<h4 class="text-primary-900 dark:text-primary-100 font-semibold">Support</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/faq">FAQs</a
					>

					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/"
					>
						Payment&amp; Delivery
					</a>

					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/">Contact Us</a
					>
				</div>
			</div>

			<div>
				<h4 class="text-primary-900 dark:text-primary-100 font-semibold">Legal</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/terms-conditions">Terms &amp; Conditions</a
					>

					<a
						class="text-primary-700 hover:text-primary-900 dark:hover:text-primary-300 unstyled"
						href="/privacy-policy">Privacy Policy</a
					>
				</div>
			</div>
		</div> -->

			<p class="sm:text-sm text-primary-700 dark:text-primary-700 text-xs">
				© {new Date().getFullYear()}
				<a href="/" class="unstyled">{PUBLIC_APP_NAME}</a>
			</p>
		</div>
	</div>
</footer>
