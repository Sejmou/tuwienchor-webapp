import argparse
import os
from utils.midi import merge_midi_files

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Merge MIDI files.")
    parser.add_argument(
        "input_directory", help="Path to the input directory containing MIDI files."
    )
    parser.add_argument(
        "--output_directory",
        default="data/out/midi",
        help="Path to the output directory for the merged MIDI file.",
    )
    args = parser.parse_args()

    # Create the output directory if it doesn't exist
    os.makedirs(args.output_directory, exist_ok=True)

    # Get the list of MIDI files in the input directory
    file_paths = [
        os.path.join(args.input_directory, file)
        for file in os.listdir(args.input_directory)
        if file.endswith(".mid")
    ]

    # Path for the output merged MIDI file
    output_file_path = os.path.join(
        args.output_directory,
        f"{os.path.basename(args.input_directory).replace(' ', '_')}.mid",
    )

    # Merge the MIDI files
    merge_midi_files(file_paths, output_file_path)
