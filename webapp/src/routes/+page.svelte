<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	$: songs = data.songs;
</script>

<div class="mx-auto flex w-full max-w-screen-lg flex-col gap-8">
	<h1 class="mt-16 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		Acapella Songs
	</h1>
	<ul>
		{#each songs as song}
			<li>
				{song.name}
			</li>
		{/each}
	</ul>
</div>
