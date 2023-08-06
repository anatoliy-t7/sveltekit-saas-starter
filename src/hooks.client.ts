import { dev } from '$app/environment';

export const handleError = ({ error, event }) => {
	if (dev) {
		console.error(error);
	}

	return {
		message: "An unexpected error occurred. We're working on it!"
	};
};
