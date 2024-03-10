<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';
	export let data: PageData;
	$: song = data.song;
</script>

<div class="mx-auto flex max-w-screen-lg flex-col items-center gap-2">
	<Button href="/" variant="outline">Zur Übersicht</Button>
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		{song.name}
	</h1>
</div>
