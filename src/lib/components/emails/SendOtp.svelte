<script lang="ts">
	import { Heading, Hr, Html, Text } from 'svelte-email';

	export let otp: string;
</script>

<Html lang="en">
	<Text>Please use the following sign in code. This code is only valid for a single use.</Text>
	<Hr />
	<Heading as="h1">{otp}</Heading>
</Html>
