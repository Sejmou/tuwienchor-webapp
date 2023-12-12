<script lang="ts">
	import { createPlaybackStore } from './playback-store';
	import TrackVolume from './TrackVolume.svelte';
	import { browser } from '$app/environment';
	import { get } from 'svelte/store';
	export let data;

	let playbackStore: ReturnType<typeof createPlaybackStore>;

	if (browser) {
		playbackStore = createPlaybackStore(data.tracks.map((track) => track.url));
	}

	$: isPlaying = playbackStore.isPlaying;
	$: currentTime = playbackStore.currentTime;
	$: duration = playbackStore.duration;

	function handlePlayPause() {
		const isPlaying = get(playbackStore.isPlaying);
		if (isPlaying) {
			playbackStore.pause();
		} else {
			playbackStore.play();
		}
	}

	function handleProgressSliderInput(event: any) {
		const target = event.target as HTMLInputElement;
		playbackStore.seekTo(target.valueAsNumber);
	}
</script>

<main class="max-w-md mx-auto my-10 p-6 rounded-md shadow-md">
	<a class="btn mb-2" href="/repertoire">Zur Übersicht</a>
	<h1 class="text-2xl font-bold mb-4">{data.songName}</h1>

	<div class="mt-4">
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
	</div>

	<div class="flex items-center justify-center space-x-4">
		<!-- Previous Button with SVG icon -->
		<button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<!-- Play Button with SVG icon -->
		<button
			class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			on:click={handlePlayPause}
		>
			{#if $isPlaying}
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
		<button class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>

	{#each playbackStore.tracks as track}
		<TrackVolume {track} />
	{/each}
</main>
