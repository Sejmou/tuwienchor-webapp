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
		drawTitle: false,
		drawSubtitle: false,
		drawComposer: false,
		drawLyricist: false
	});
	osmd.EngravingRules.RenderSingleHorizontalStaffline = true;
	osmd.EngravingRules.PageTopMargin = 0;
	osmd.EngravingRules.PageBottomMargin = 0;
	osmd.EngravingRules.PageLeftMargin = 0;
	osmd.EngravingRules.PageRightMargin = 0;
	// uncomment the following for specific fixed measure width
	// osmd.EngravingRules.FixedMeasureWidth = true;
	// osmd.EngravingRules.FixedMeasureWidthFixedValue = 16;
	// TODO: figure out how to reduce distance between staves for every part
	// stuff below doesn't work
	// osmd.EngravingRules.BetweenStaffDistance = 0;
	// osmd.EngravingRules.StaffDistance = 0;
	// osmd.EngravingRules.BetweenStaffDistance = 0;
	// osmd.EngravingRules.BetweenStaffLinesDistance = 0;
	await osmd.load(musicXml);
	osmd.render();

	console.log(osmd.Sheet.Parts.map((p) => p.NameLabel.text));
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
