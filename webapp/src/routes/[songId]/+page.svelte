<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import JSZip from 'jszip';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import SheetMusic from '$lib/components/SheetMusic/sheet-music.svelte';
	export let data: PageData;
	$: song = data.song;

	async function loadMusicXML() {
		const response = await fetch(`/mxl/${song.id}.mxl`);
		const jsZip = new JSZip();
		const archive = await jsZip.loadAsync(await response.arrayBuffer());
		const musicXml = archive.file('score.xml')?.async('string');
		if (!musicXml) {
			throw new Error('No score.xml found in MXL file');
		}
		return musicXml;
	}
</script>

<div class="mx-auto flex max-w-screen-lg flex-col items-center gap-2">
	<Button href="/" variant="outline">Back to Overview</Button>
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		{song.name}
	</h1>
	{#await loadMusicXML()}
		<p>Loading...</p>
	{:then musicXml}
		<SheetMusic {musicXml} />
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
