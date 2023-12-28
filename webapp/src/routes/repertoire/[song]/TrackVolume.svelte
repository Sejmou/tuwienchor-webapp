<script lang="ts">
	import type { createPlaybackStore } from './playback-store';
	export let track: ReturnType<typeof createPlaybackStore>['tracks'][0];

	$: name = track.name;
	$: volume = track.volume;

	function handleSliderInput(event: any) {
		const target = event.target as HTMLInputElement;
		volume.set(target.valueAsNumber);
	}
</script>

<div class="mt-4">
	<label for="volume" class="block text-sm font-medium text-gray-600">{name}:</label>
	<input
		type="range"
		id="volume"
		min="0"
		max="1"
		step="0.01"
		value={$volume}
		on:input={handleSliderInput}
		class="w-full mt-1"
	/>
</div>
