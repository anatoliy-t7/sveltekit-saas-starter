<script lang="ts">
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { onNavigate } from '$app/navigation';
	import '../app.css';
	import { Toast } from '@skeletonlabs/skeleton';

	initializeStores();
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<Toast></Toast>
<slot />
