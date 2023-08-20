<script lang="ts">
	import IconEdit from '~icons/tabler/edit';
	import Pagination from '$lib/components/Pagination.svelte';

	export let data;
	let url = '/admin/users/';
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<main class="p-8 max-w-screen-xl space-y-6">
	<div class="flex justify-between items-center">
		<h3>Users</h3>
		<a href="/admin/users/new" class="btn variant-soft-primary">Add new</a>
	</div>

	<div class="table-container">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Name</th>
					<th>Active</th>
					<th>Email</th>
					<th>Role</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each data.users[0] as user}
					<tr>
						<td>
							{user.name || ''}
						</td>
						<td>
							{#if user.active}
								<span class="badge-icon variant-soft-secondary" />
							{:else}
								<span class="badge-icon variant-filled" />
							{/if}
						</td>
						<td>
							{user.email}
						</td>
						<td>
							{user.role}
						</td>
						<td>
							<a href="/admin/users/{user.id}" class="hover w-6">
								<IconEdit class="w-6 h-6" />
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<Pagination pagination={data.users[1]} {url} />
	</div>
</main>
