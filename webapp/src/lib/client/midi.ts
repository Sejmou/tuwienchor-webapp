import type { Midi } from '@tonejs/midi';

export async function loadMidi(songId: string): Promise<Midi> {
	const Midi = (await import('@tonejs/midi')).Midi;
	const response = await Midi.fromUrl(`/midi/${songId}.mid`);
	console.log(response);
	return response;
}
