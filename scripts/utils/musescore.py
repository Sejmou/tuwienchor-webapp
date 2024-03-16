import os
import shutil
import zipfile
import xml.etree.ElementTree as ET
from os.path import basename, splitext, abspath, dirname
import subprocess
from typing import Union

MUSESCORE3_PATH = "/Applications/MuseScore 3.app/Contents/MacOS/mscore"
MUSESCORE4_PATH = "/Applications/MuseScore 4.app/Contents/MacOS/mscore"
EXPORT_FORMATS = [
    # Free Lossless Audio Codec (compressed audio)
    "flac",
    # Various score metadata (JSON)
    "metajson",
    # Standard MIDI file
    "mid",
    # Standard MIDI file
    "midi",
    # Internal file sanity check log (JSON)
    "mlog",
    # MPEG Layer III (lossy compressed audio)
    "mp3",
    # Measure positions (XML)
    "mpos",
    # Uncompressed MuseScore file
    "mscx",
    # Compressed MuseScore file
    "mscz",
    # Uncompressed MusicXML file
    "musicxml",
    # Compressed MusicXML file
    "mxl",
    # OGG Vorbis (lossy compressed audio)
    "ogg",
    # Portable document file (print)
    "pdf",
    # Portable network graphics (image) — Individual files, one per score page, with a hyphen-minus followed by the page number placed before the file extension, will be generated.
    "png",
    # Segment positions (XML)
    "spos",
    # Scalable vector graphics (image)
    "svg",
    # RIFF Waveform (uncompressed audio)
    "wav",
    # Uncompressed MusicXML file
    "xml",
]


def export_to_other_format(
    mscz_path, output_format="midi", target_dir=None
) -> Union[str, None]:
    """
    Export the given .mscz file as a file.

    :param mscz_path: Path to the .mscz file
    :param target_dir: Path to the directory where the output file

    :return: Path to the generated midi file
    """

    if output_format not in EXPORT_FORMATS:
        raise ValueError(f"Unsupported export format {output_format}")
    filename = f"{splitext(basename(mscz_path))[0]}.{output_format}"
    if target_dir is None:
        target_dir = os.path.join(abspath(dirname(mscz_path)), output_format)
    output_path = os.path.join(target_dir, filename)
    print(f"Exporting {mscz_path} to {output_path}...")

    ms_version = get_musescore_version(mscz_path)
    if ms_version == 3:
        ms_path = MUSESCORE3_PATH
    elif ms_version == 4:
        ms_path = MUSESCORE4_PATH
    else:
        raise ValueError(f"Unsupported musescore version {ms_version}")
    try:
        subprocess.run(
            [
                ms_path,
                mscz_path,
                "-o",
                output_path,
            ],
            check=True,
        )
        return output_path
    except subprocess.CalledProcessError as e:
        print(f"Error while processing file {mscz_path}")
        print(e)
        return None


def get_musescore_version(file_path):
    """
    Given a path to a .mscz file, return the version of musescore used to create the file.
    """
    # Get the element tree from the mscz file
    tree = get_content_tree_from_musescore_file(file_path)

    # Get the root element of the tree
    root = tree.getroot()

    # Get the programVersion element and extract the major version number
    version_element = root.find(".//programVersion")
    if version_element is not None:
        return int(version_element.text.split(".")[0])
    else:
        raise ValueError(f"No version information found in {file_path}")


def get_content_tree_from_musescore_file(file_path):
    """
    Extract the <whatever_name>.mscx file from a musescore file (.mscz),
    parse it as an XML document and return the element tree
    """
    file_name = os.path.basename(file_path)
    file_name_without_extension = os.path.splitext(file_name)[0]
    temp_folder_name = f"{file_name_without_extension}_temp"

    try:
        # Every .mscz file is essentially a zip file - unzip to a temporary folder
        with zipfile.ZipFile(file_path, "r") as zip_ref:
            zip_ref.extractall(temp_folder_name)

        # mscx file in the mscz file is essentially an XML document describing most of the content of the score
        mscx_file_name = next(
            (f for f in os.listdir(temp_folder_name) if f.endswith(".mscx")), None
        )
        if mscx_file_name is None:
            raise FileNotFoundError(f"No .mscx file in {file_path}")

        score_file_path = os.path.join(temp_folder_name, mscx_file_name)
        with open(score_file_path, "r", encoding="utf-8") as score_file:
            # Parse the XML content and find the programVersion element
            tree = ET.parse(score_file)
            if tree is None:
                raise ValueError(f"No root element found in {file_path}")
            return tree

    finally:
        shutil.rmtree(temp_folder_name, ignore_errors=True)


def pretty_print_xml(element):
    print(ET.tostring(element, encoding="unicode", short_empty_elements=False))
