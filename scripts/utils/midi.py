import mido
from mido import MidiFile, Message


def merge_midi_files(file_paths, output_file_path, set_to_grand_piano=True):
    merged_midi = mido.MidiFile()
    for path in file_paths:
        midi = mido.MidiFile(path)
        for track in midi.tracks:
            merged_midi.tracks.append(track)
    if set_to_grand_piano:
        set_tracks_to_grand_piano_sound(merged_midi)

    merged_midi.save(output_file_path)


def set_tracks_to_grand_piano_sound(mid: MidiFile):
    """
    Set all tracks in the MIDI file to use the Grand Piano sound.

    This is done by adding a Program Change message (w/ program 0) at the start of each track.
    If a Program Change message already exists in the track, it is modified accordingly.
    """
    for track in mid.tracks:
        # Look for an existing Program Change message early in the track
        found_program_change = False
        for msg in track:
            if msg.type == "program_change":
                # Change the instrument to Grand Piano
                msg.program = 0
                found_program_change = True
                break  # Stop after the first Program Change message

        # If no Program Change message was found, add one at the start
        if not found_program_change:
            # Insert a Program Change message at the beginning of the track
            track.insert(0, Message("program_change", program=0, time=0))
