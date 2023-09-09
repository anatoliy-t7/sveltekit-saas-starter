// @ts-check
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { skeletonTheme } from './skeleton-theme';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		container: {
			padding: '1rem'
		},
		extend: {}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		skeleton({
			themes: {
				custom: [skeletonTheme]
			}
		})
	]
};
