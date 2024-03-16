import type { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import Root from './player-root.svelte';
import PlayerControls from './player-controls.svelte';
import { derived, get, readable } from 'svelte/store';

// original AudioPlayer PlaybackState is enum with the following values and not exported
type PlaybackState = 'INIT' | 'PLAYING' | 'PAUSED' | 'STOPPED';
export type Player = Awaited<ReturnType<typeof createSheetMusicPlayer>>;

export async function createSheetMusicPlayer(musicXml: string, scoreContainer: HTMLDivElement) {
	const osmd = await loadScore(musicXml, scoreContainer);
	const player = await createAudioPlayer(osmd);

	const playbackState = readable<PlaybackState>('INIT', (set) => {
		setInterval(() => {
			const currentState = player.state as PlaybackState;
			set(currentState);
		}, 300);
	});
	playbackState.subscribe((state) => {
		console.log('state', state);
	});
	const playing = derived(playbackState, ($playbackState) => $playbackState === 'PLAYING');

	async function handlePlayPause() {
		const $playing = get(playing);
		if ($playing) {
			player.pause();
		} else {
			player.play();
		}
	}

	return {
		playbackState,
		playing,
		handlePlayPause
	};
}

async function loadScore(musicXml: string, scoreContainer: HTMLDivElement) {
	const OpenSheetMusicDisplay = (await import('opensheetmusicdisplay')).OpenSheetMusicDisplay;
	const osmd = new OpenSheetMusicDisplay(scoreContainer, {
		// makes margins more narrow and removes stuff like title, composer, etc.
		drawingParameters: 'compacttight'
	});
	await osmd.load(musicXml);
	osmd.render();
	return osmd;
}

async function createAudioPlayer(osmd: OpenSheetMusicDisplay) {
	const AudioPlayer = (await import('osmd-audio-player')).default;
	const audioPlayer = new AudioPlayer();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await audioPlayer.loadScore(osmd as any);
	return audioPlayer;
}

export { Root, Root as SheetMusicPlayer, PlayerControls };
