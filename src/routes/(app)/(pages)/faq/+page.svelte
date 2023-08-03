<script lang="ts">
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<svelte:head>
	<title>FAQ - {PUBLIC_APP_NAME}</title>
</svelte:head>

<article class="px-4 max-w-screen-xl mx-auto">
	<div class="prose mx-auto">
		<h1 class="pl-3">FAQ</h1>
		<Accordion autocollapse>
			<AccordionItem open>
				<svelte:fragment slot="summary"><strong>Question 1</strong></svelte:fragment>
				<svelte:fragment slot="content"
					>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nesciunt officia, quos maxime
					quia quisquam non veritatis dolorum repellat ad suscipit, voluptatum cupiditate dolores
					vel dolore? Laudantium tempora illum repudiandae!</svelte:fragment
				>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="summary"><strong>Question 2</strong></svelte:fragment>
				<svelte:fragment slot="content"
					>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nesciunt officia, quos maxime
					quia quisquam non veritatis dolorum repellat ad suscipit, voluptatum cupiditate dolores
					vel dolore? Laudantium tempora illum repudiandae!</svelte:fragment
				>
			</AccordionItem>
			<AccordionItem>
				<svelte:fragment slot="summary"><strong>Question 3</strong></svelte:fragment>
				<svelte:fragment slot="content"
					>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab nesciunt officia, quos maxime
					quia quisquam non veritatis dolorum repellat ad suscipit, voluptatum cupiditate dolores
					vel dolore? Laudantium tempora illum repudiandae!</svelte:fragment
				>
			</AccordionItem>
		</Accordion>
	</div>
</article>
