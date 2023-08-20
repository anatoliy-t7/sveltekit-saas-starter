<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
</script>

<footer class="border-slate-100 py-12 border-t">
	<div class="max-w-screen-xl px-4 mx-auto">
		<div class="sm:grid-cols-3 lg:grid-cols-4 grid grid-cols-1 gap-6 mb-10">
			<div>
				<a href="/">
					<Logo />
				</a>
			</div>

			<div>
				<h4 class="text-slate-600 dark:text-slate-100 font-semibold">About</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled" href="/"
						>Dream</a
					>
					<a class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled" href="/"
						>Team</a
					>
					<a class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled" href="/"
						>Company</a
					>
				</div>
			</div>

			<div>
				<h4 class="text-slate-600 dark:text-slate-100 font-semibold">Support</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a
						class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled"
						href="/faq">FAQs</a
					>

					<a class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled" href="/"
						>Contact Us</a
					>
				</div>
			</div>

			<div>
				<h4 class="text-slate-600 dark:text-slate-100 font-semibold">Legal</h4>

				<div class="grid mt-3 space-y-3 text-sm">
					<a
						class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled"
						href="/terms-conditions">Terms &amp; Conditions</a
					>

					<a
						class="text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 unstyled"
						href="/privacy-policy">Privacy Policy</a
					>
				</div>
			</div>

			<p class="sm:text-sm text-slate-500 dark:text-slate-500 text-xs">
				© {new Date().getFullYear()}
				<a href="/" class="unstyled">{PUBLIC_APP_NAME}</a>
			</p>
		</div>
	</div>
</footer>
