<script lang="ts">
	import type { createPlaybackStore } from './playback-store';
	type PlaybackStore = ReturnType<typeof createPlaybackStore>;
	export let playbackStore: PlaybackStore;
	let preferredTrackName = '';

	function getPreferredTrack(tracks: PlaybackStore['tracks']) {
		const preferredTrack = tracks.find((track) => track.name === preferredTrackName);
		return preferredTrack || tracks[0]!;
	}

	$: tracks = playbackStore.tracks;
	$: focusedTrack = getPreferredTrack(tracks);
	$: otherTracks = tracks.filter((track) => track !== focusedTrack);
	$: focusVolume = focusedTrack.volume;

	function handleSelect(event: any) {
		const target = event.target as HTMLSelectElement;
		const trackName = target.value;
		console.log(trackName);
		focusedTrack = tracks.find((track) => track.name === trackName)!;
		preferredTrackName = focusedTrack.name;
	}

	function reset() {
		focusedTrack.volume.set(0.5);
		focusVolume = focusedTrack.volume;
		otherTracks.forEach((track) => {
			track.volume.set(0.5);
		});
	}

	function handleFocusedVsOtherMixSliderInput(event: any) {
		const target = event.target as HTMLInputElement;
		const value = target.valueAsNumber;
		focusedTrack.volume.set(value);
		otherTracks.forEach((track) => {
			track.volume.set(1 - value);
		});
	}
</script>

<div class="flex flex-col w-full">
	<label class="form-control">
		<div class="label">
			<span class="label-text">Automix Fokus-Track</span>
		</div>
		<select
			bind:value={preferredTrackName}
			on:change={handleSelect}
			class="select select-bordered w-full max-w-xs"
		>
			{#each tracks as track}
				<option value={track.name}>{track.name}</option>
			{/each}
		</select>
		<div class="label">
			<span class="label-text-alt"
				>Machst du ihn lauter, werden die anderen leiser (und umgekehrt).</span
			>
			<span class="label-text-alt"></span>
		</div>
	</label>
	<div class="flex gap-2">
		<div class="w-full flex-1">
			<label class="block text-sm font-medium text-gray-600"
				>Verhältnis {focusedTrack.name} : Rest</label
			>
			<input
				class="w-full"
				type="range"
				min="0"
				max="1"
				step="0.01"
				value={focusVolume}
				on:input={handleFocusedVsOtherMixSliderInput}
			/>
		</div>
		<button class="btn" on:click={reset}>Reset</button>
	</div>
</div>
