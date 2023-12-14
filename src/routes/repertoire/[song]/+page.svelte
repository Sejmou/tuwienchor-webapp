<script lang="ts">
	import { createPlaybackStore } from './playback-store';
	import TrackVolume from './TrackVolume.svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import AutoMix from './AutoMix.svelte';
	type PlaybackStore = ReturnType<typeof createPlaybackStore>;
	export let data;

	let song: string | undefined = get(page).params.song;
	let playbackStore = createPlaybackStore(data.tracks.map((track) => track.url));

	page.subscribe((value) => {
		const newSong = value.params.song;
		console.log(newSong, song);
		if (newSong != song) {
			playbackStore.pause();
			playbackStore = createPlaybackStore(data.tracks.map((track) => track.url));
		}
		song = newSong;
	});

	$: isPlaying = playbackStore.isPlaying;
	$: currentTime = playbackStore.currentTime;
	$: duration = playbackStore.duration;

	$: nextLink = data.nextSong ? `/repertoire/${data.nextSong}` : null;
	$: previousLink = data.previousSong ? `/repertoire/${data.previousSong}` : null;

	function handlePlayPause(playbackStore: PlaybackStore) {
		const isPlaying = get(playbackStore.isPlaying);
		if (isPlaying) {
			playbackStore.pause();
		} else {
			playbackStore.play();
		}
	}

	// part of nasty workaround for progress slider
	let displayPlayingDespitePaused = false;
	function handleProgressSliderInput(event: any) {
		const target = event.target as HTMLInputElement;
		const isPlaying = get(playbackStore.isPlaying);
		// hoping this extra logic for if (isPlaying) will make things less janky
		displayPlayingDespitePaused = true;
		if (isPlaying) playbackStore.pause();
		playbackStore.seekTo(target.valueAsNumber);

		if (isPlaying)
			setTimeout(() => {
				playbackStore.play();
				displayPlayingDespitePaused = false;
			}, 100);
	}

	let mixerMode: 'auto' | 'manual' = 'auto';

	function handleMixerModeSelect(event: any) {
		const target = event.target as HTMLSelectElement;
		mixerMode = target.value as 'auto' | 'manual';
	}
</script>

<svelte:head>
	<title>
		{data.songName.substring(0, 2)}
		{data.songName.substring(2).replaceAll('_', ' ')} | TU Wien Chor Repertoire
	</title>
</svelte:head>

<div class="w-full card shadow-xl bg-base-300">
	<div class="card-body flex flex-col w-full gap-2">
		<a class="btn mb-2" href="/repertoire">Zur Übersicht</a>
		<h1 class="text-2xl font-bold mb-4">
			{data.songName.substring(0, 2)}
			{data.songName.substring(2).replaceAll('_', ' ')}
		</h1>
		<div>
			<div class="w-full">
				<input
					type="range"
					id="progress"
					min="0"
					max={$duration}
					step="0.1"
					value={$currentTime}
					on:input={handleProgressSliderInput}
					class="w-full mt-1"
				/>
				<div class="mt-[-4px] mb-1">
					{#if $currentTime}
						{#if $duration}
							<div class="w-full flex justify-between">
								<div class="text-xs text-gray-500">
									{Math.floor($currentTime / 60)}:{Math.floor($currentTime % 60)
										.toString()
										.padStart(2, '0')}
								</div>
								<div class="text-xs text-gray-500">
									{Math.floor($duration / 60)}:
									{Math.floor($duration % 60)
										.toString()
										.padStart(2, '0')}
								</div>
							</div>
						{/if}
					{:else}
						<div class="text-xs text-gray-500">--:--</div>
					{/if}
				</div>
			</div>
			<div class="flex items-center justify-center space-x-4">
				<!-- Previous Button with SVG icon -->
				<a href={previousLink}>
					<button disabled={!previousLink} class="btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</button>
				</a>
				<!-- Play Button with SVG icon -->
				<button class="btn btn-accent" on:click={() => handlePlayPause(playbackStore)}>
					{#if $isPlaying || displayPlayingDespitePaused}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 3l14 9-14 9V3z"
							/>
						</svg>
					{/if}
				</button>
				<!-- Next Button with SVG icon -->
				<a href={nextLink}>
					<button disabled={!nextLink} class="btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</button>
				</a>
			</div>
		</div>
		<div>
			<h5>Mixer</h5>
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<span class="label-text">Modus</span>
				</div>
				<select
					bind:value={mixerMode}
					on:change={handleMixerModeSelect}
					class="select select-bordered"
				>
					<option value="auto">Automix</option>
					<option value="manual">Manuell</option>
				</select>
			</label>
			{#if mixerMode == 'manual'}
				<div class="grid grid-cols-2 gap-2">
					{#each playbackStore.tracks as track}
						<TrackVolume {track} />
					{/each}
				</div>
			{:else}
				<AutoMix {playbackStore} />
			{/if}
		</div>
	</div>
</div>
