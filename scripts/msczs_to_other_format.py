import os
import argparse
from utils.musescore import export_to_other_format
from utils.midi import set_tracks_to_grand_piano_sound

if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description="Export mscz files to some other format."
    )
    parser.add_argument(
        "-i",
        "--input_dir",
        default="data/mscz_files",
        help="Path to the directory containing the input mscz files.",
    )
    parser.add_argument(
        "-o",
        "--output_dir",
        help="Path to the output directory for the generated midi files.",
    )
    parser.add_argument(
        "-f",
        "--format",
        default="midi",
        help="The format to convert the mscz files to. Default is midi.",
    )
    args = parser.parse_args()

    # Get the list of mscz files in the input directory
    file_paths = [
        os.path.join(args.input_dir, file)
        for file in os.listdir(args.input_dir)
        if file.endswith(".mscz")
    ]

    successes = []
    failures = []

    output_format = args.format or "midi"
    output_dir = args.output_dir or f"data/out/{output_format}"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir, exist_ok=True)

    for file_path in file_paths:
        outpath = export_to_other_format(
            file_path, target_dir=output_dir, output_format=output_format
        )
        if outpath is not None:
            if output_format == "midi":
                set_tracks_to_grand_piano_sound(outpath)
            successes.append(outpath)
        else:
            failures.append(file_path)

    if len(successes) > 0:
        print(f"\nSuccessfully converted {len(successes)} files")
        print(successes)
    if len(failures) > 0:
        print(f"\nFailed to convert {len(failures)} files")
        print(failures)
