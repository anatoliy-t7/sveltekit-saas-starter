<script lang="ts">
	import { Button, Hr, Html, Text } from 'svelte-email';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	export let link: string;
</script>

<Html lang="en">
	<Text>You’re almost ready to start enjoying {PUBLIC_APP_NAME}</Text>
	<Text>Simply click the big button below to verify your email address.</Text>
	<Hr />
	<Button href={link}>Verify Email</Button>
</Html>
