<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import MidiPlayer from '$lib/components/midi/MIDIPlayer.svelte';
	import { browser } from '$app/environment';
	import { loadMidi } from '$lib/client/midi';
	import type { PageData } from './$types';
	export let data: PageData;
	$: song = data.song;
</script>

<div class="mx-auto flex max-w-screen-lg flex-col items-center gap-2">
	<Button href="/" variant="outline">Back to Overview</Button>
	<h1 class="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
		{song.name}
	</h1>
	{#if browser}
		{#await loadMidi(song.id)}
			<p>Loading...</p>
		{:then midi}
			<MidiPlayer {midi} />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	{/if}
</div>
