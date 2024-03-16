import mido
from mido import MidiFile, Message


def set_tracks_to_grand_piano_sound(midi_path: str):
    """
    Set all tracks in the provided MIDI file to use the Grand Piano sound.

    This is done by adding a Program Change message (w/ program 0) at the start of each track.
    If a Program Change message already exists in the track, it is modified accordingly.
    """
    mid = MidiFile(midi_path)

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

    mid.save(midi_path)
