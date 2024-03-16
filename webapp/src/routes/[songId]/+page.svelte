<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import JSZip from 'jszip';
	import type { PageData } from './$types';
	import { SheetMusicPlayer } from '$lib/components/SheetMusicPlayer';
	export let data: PageData;
	$: song = data.song;

	async function loadMusicXML() {
		const response = await fetch(`/mxl/${song.id}.mxl`);
		const jsZip = new JSZip();
		const archive = await jsZip.loadAsync(await response.arrayBuffer());
		const musicXml = await archive.file('score.xml')?.async('string');
		if (!musicXml) {
			throw new Error('No score.xml found in MXL file');
		}
		return convertNonDrumInstrumentsToPiano(musicXml);
	}

	function convertNonDrumInstrumentsToPiano(musicXml: string): string {
		const parser: DOMParser = new DOMParser();
		const xmlDoc: Document = parser.parseFromString(musicXml, 'application/xml');

		const midiInstruments: HTMLCollectionOf<Element> =
			xmlDoc.getElementsByTagName('midi-instrument');

		for (let i = 0; i < midiInstruments.length; i++) {
			// Find the midi-channel for this instrument
			const midiChannelElements: HTMLCollectionOf<Element> =
				midiInstruments[i]!.getElementsByTagName('midi-channel');

			if (midiChannelElements.length > 0) {
				const midiChannel: Element = midiChannelElements[0]!;

				const isDrumPart = midiChannel.textContent === '10';
				if (!isDrumPart) {
					const midiProgramElements: HTMLCollectionOf<Element> =
						midiInstruments[i]!.getElementsByTagName('midi-program');

					if (midiProgramElements.length > 0) {
						const midiProgram: Element = midiProgramElements[0]!;
						midiProgram.textContent = '1'; // '1' == Grand Piano Sound
					}
				}
			}
		}

		// Serialize the DOM object back into a string
		const serializer: XMLSerializer = new XMLSerializer();
		const updatedXmlString: string = serializer.serializeToString(xmlDoc);
		return updatedXmlString;
	}
</script>

<svelte:head>
	<title>{song.name} | Acapella Songs</title>
</svelte:head>

<div class="mx-auto flex max-w-screen-lg flex-col items-center gap-2">
	<Button href="/" variant="outline">Back to Overview</Button>
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		{song.name}
	</h1>
	{#await loadMusicXML()}
		<p>Loading score...</p>
	{:then musicXml}
		<SheetMusicPlayer {musicXml} />
	{:catch error}
		<p>Error: {error.message}</p>
	{/await}
</div>
