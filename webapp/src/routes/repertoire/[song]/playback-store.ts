import { derived, writable } from 'svelte/store';

export function createPlaybackStore(audioSrcs: string[]) {
	if (audioSrcs.length === 0) {
		throw new Error('No audio sources provided');
	}
	// one track has to be the 'main' track that defines the currentTime to which all other tracks are synced (in terms of playback state, i.e. playing/paused and currentTime)
	const mainTrackStore = createAudioTrackStore(audioSrcs[0]!);
	const remainingSrcs = audioSrcs.slice(1);
	const remainingTrackStores = remainingSrcs.map(createAudioTrackStore);

	for (const trackStore of remainingTrackStores) {
		mainTrackStore.isPlaying.subscribe((playing) => {
			trackStore.isPlaying.set(playing);
		});
	}

	// user can only control main track; other tracks sync to it!
	const play = () => mainTrackStore.isPlaying.set(true);
	const pause = () => mainTrackStore.isPlaying.set(false);

	const allTrackStores = [mainTrackStore, ...remainingTrackStores];
	const seekTo = (time: number) => allTrackStores.forEach((trackStore) => trackStore.seekTo(time));

	// duration and currentTime should also be visible to user (read-only!)
	const duration = derived(mainTrackStore.duration, ($duration) => {
		return $duration;
	});
	const currentTime = mainTrackStore.currentTime;

	const tracks = allTrackStores.map((trackStore) => {
		const { name, volume } = trackStore;
		return { name, volume };
	});

	return {
		play,
		pause,
		isPlaying: mainTrackStore.isPlaying,
		seekTo,
		duration,
		currentTime,
		tracks
	};
}

export function createAudioTrackStore(audioSrc: string) {
	const audio = new Audio(audioSrc);

	const isPlaying = writable(false);
	isPlaying.subscribe((playing) => {
		if (playing) {
			audio.play();
		} else {
			audio.pause();
		}
	});

	const volume = writable(0.5);
	volume.subscribe((volume) => {
		audio.volume = volume;
	});

	const currentTimeInternal = writable(audio.currentTime);
	const currentTime = derived(currentTimeInternal, ($currentTime) => {
		return $currentTime;
	});

	// not sure if this is necessary
	const durationInternal = writable(audio.duration);
	setInterval(() => {
		durationInternal.set(audio.duration);
	}, 1000);
	const duration = derived(durationInternal, ($duration) => {
		return $duration;
	});

	setInterval(() => {
		currentTimeInternal.set(audio.currentTime);
	}, 50);

	const seekTo = (time: number) => {
		audio.currentTime = time;
	};

	return {
		name: audioSrc.split('/').pop()!.split('.')[0]!,
		currentTime,
		duration,
		seekTo,
		isPlaying,
		volume
	};
}
