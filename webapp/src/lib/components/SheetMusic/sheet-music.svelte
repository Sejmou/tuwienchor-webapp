<script lang="ts">
	import type { OpenSheetMusicDisplay, Cursor } from 'opensheetmusicdisplay';
	import type AudioPlayer from 'osmd-audio-player';
	import { Play } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { readable, get, writable } from 'svelte/store';
	export let musicXml: string;

	let osmd: OpenSheetMusicDisplay;
	let cursor: Cursor;
	let player: AudioPlayer;
	let container: HTMLDivElement;

	async function loadScore() {
		const OpenSheetMusicDisplay = (await import('opensheetmusicdisplay')).OpenSheetMusicDisplay;
		osmd = new OpenSheetMusicDisplay(container, {
			// makes margins more narrow and removes stuff like title, composer, etc.
			drawingParameters: 'compacttight'
		});
		await osmd.load(musicXml);
		osmd.render();
		cursor = osmd.cursor;
	}

	const playing = readable(false);
	const initialized = writable(false);

	async function handlePlay() {
		if (!get(initialized)) {
			await initPlayer();
			initialized.set(true);
		}
		const $playing = get(playing);
		if ($playing) {
			player.pause();
		} else {
			player.play();
		}
	}

	async function initPlayer() {
		const AudioPlayer = (await import('osmd-audio-player')).default;
		player = new AudioPlayer();
		await player.loadScore(osmd as any);
	}
</script>

{#await loadScore()}
	<p>Loading...</p>
{:then}
	<!-- score is rendered by OpenSheetMusicDisplay into div below! -->
	<div class="absolute bottom-4 left-0 z-50 flex h-16 w-full justify-center">
		<Button on:click={handlePlay}>
			<Play />
		</Button>
	</div>
{:catch error}
	<p>Error loading score: {error.message}</p>
{/await}
<div class="w-[95vw]">
	<div class="w-full" bind:this={container} />
</div>
