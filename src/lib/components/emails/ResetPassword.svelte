<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	export let link: string;
</script>

<Html lang="en">
	<Text>{PUBLIC_APP_NAME}</Text>
	<Text>Please reset your password via the link below:</Text>
	<Hr />
	<Button href={link}>Reset password</Button>
</Html>
