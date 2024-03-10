<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import * as Card from '$lib/components/ui/card';

	$: songs = data.songs;
</script>

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-8">
	<h1 class="mt-16 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Acapella Songs
	</h1>

	<Card.Root>
		<Card.Header>
			<Card.Title>Repertoire</Card.Title>
			<!-- <Card.Description></Card.Description> -->
		</Card.Header>
		<Card.Content>
			<ul class="list-none divide-y divide-muted rounded-lg border-muted">
				{#each songs as song}
					<li>
						<a class="block p-4 hover:bg-muted" href={`/${song.id}`}>{song.name}</a>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
</div>
