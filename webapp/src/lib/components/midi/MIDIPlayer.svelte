<script lang="ts">
	import type { Midi } from '@tonejs/midi';
	import * as Tone from 'tone';
	import { Button } from '$lib/components/ui/button';
	import { Play, Pause } from 'lucide-svelte';
	import { createMidiPlayer } from './midi-player';
	export let midi: Midi;
	const player = createMidiPlayer(midi);
	const { playing, togglePlayback } = player;
</script>

<p>{midi.tracks.length} tracks</p>
<ul>
	{#each midi.tracks as track}
		<li>{track.name}</li>
	{/each}
</ul>
<Button on:click={togglePlayback}>
	{#if $playing}
		<Pause />
	{:else}
		<Play />
	{/if}
</Button>
