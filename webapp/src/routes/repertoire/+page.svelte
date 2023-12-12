<script lang="ts">
	export let data;
</script>

<main class="mx-auto">
	<p class="mb-2">Das Repertoire umfasst aktuell:</p>
	<ul class="list-disc pl-4">
		{#each data.songs as path}
			<li class="mb-2 hover:underline">
				<a href={`/repertoire/${path}`}>
					{path}
				</a>
			</li>
		{/each}
	</ul>
	<p>Einfach auf die Songs klicken um sie anzuhören!</p>
</main>
