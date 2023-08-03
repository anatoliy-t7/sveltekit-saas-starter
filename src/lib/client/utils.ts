import type { RequestEvent } from '@sveltejs/kit';
import { readable } from 'svelte/store';
import { navigating } from '$app/stores';

export function handleLoginRedirect(event: RequestEvent) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}`;
}

export const previousPage = readable(null, (set) => {
	const unsubscribe = navigating.subscribe(($navigating) => {
		// Check if `$navigating` has a value
		// because it's set to `null` after navigation is done
		if ($navigating) {
			set($navigating.from?.url.pathname);
		}
	});

	return () => unsubscribe();
});

export function clickOutside(node) {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click-outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

const removeQueryValue = (params: URLSearchParams, key: string, valueToRemove: any) => {
	const values = params.getAll(key);
	if (values.length) {
		params.delete(key);
		for (const value of values) {
			if (value !== String(valueToRemove)) {
				params.append(key, value);
			}
		}
	}
};
