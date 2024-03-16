<script lang="ts">
	import type { OpenSheetMusicDisplay, Cursor } from 'opensheetmusicdisplay';
	import { onMount } from 'svelte';
	export let musicXml: string;

	let osmd: OpenSheetMusicDisplay;
	let cursor: Cursor;
	let container: HTMLDivElement;

	async function loadScore() {
		const OpenSheetMusicDisplay = (await import('opensheetmusicdisplay')).OpenSheetMusicDisplay;
		osmd = new OpenSheetMusicDisplay(container, {
			drawingParameters: 'compacttight'
			// drawTitle: false,
			// drawSubtitle: false,
			// drawComposer: false,
			// drawCredits: false,
			// drawLyricist: false
		});
		osmd.load(musicXml).then(() => {
			osmd.render();
			cursor = osmd.cursor;
		});
	}
</script>

{#await loadScore()}
	<p>Loading...</p>
{:then}
	<!-- Show nothing here, score is rendered by OpenSheetMusicDisplay into div below! -->
{:catch error}
	<p>Error loading score: {error.message}</p>
{/await}
<div class="w-[95vw]">
	<div class="w-full" bind:this={container} />
</div>
