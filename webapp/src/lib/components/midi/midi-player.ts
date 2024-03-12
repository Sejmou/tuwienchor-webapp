import type { Midi } from '@tonejs/midi';
import { derived, get, writable } from 'svelte/store';
import * as Tone from 'tone';

export function createMidiPlayer(midi: Midi) {
	const playingInternal = writable(false);
	// using PolySynths as sometimes a single track can still have multiple voices (i.e. notes playing at the same time)
	const synths: Tone.Synth[] = [];

	function play() {
		playingInternal.set(true);
		// apparently, we cannot start playback immediately, might result in audio glitches
		// hence, we schedule playback 100ms in the future
		const now = Tone.now() + 0.1;
		for (const track of midi.tracks) {
			//create a synth for each track
			const synth = new Tone.Synth().toDestination();
			synths.push(synth);
			//schedule all of the events
			for (const note of track.notes) {
				synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
			}
		}
	}

	async function stop() {
		while (synths.length > 0) {
			const synth = synths.pop();
			if (synth) {
				synth.dispose();
			}
		}
		playingInternal.set(false);
	}

	const playing = derived(playingInternal, ($playingInternal) => {
		return $playingInternal;
	});

	function togglePlayback() {
		const playing = get(playingInternal);
		if (playing) {
			stop();
		} else {
			play();
		}
	}

	return {
		playing,
		togglePlayback
	};
}
