# %%
import os
from utils.musescore import create_part_mp3s
from os.path import basename, splitext


def get_musescore_files(folder_path):
    """
    Recursively search for all files in the folder_path
    """
    musescore_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".mscz"):
                musescore_files.append(os.path.join(root, file))
    return musescore_files


def load_lines(file_path):
    with open(file_path, "r") as f:
        lines = [l.strip() for l in f.readlines()]
    return lines

def export_mp3s(ms_file, mp3_folder):
    folder_name = splitext(basename(ms_file))[0]
    subfolder_path = os.path.join(mp3_folder, folder_name)
    if os.path.exists(subfolder_path):
        print(f"Skipping {folder_name} because it already exists")
        return
    create_part_mp3s(ms_file, subfolder_path)
    print(f"Created mp3s for {folder_name}")

# %%
ms_files = get_musescore_files("data/mscz_files")
ms_files
mp3_folder = "data/mp3s/"
os.makedirs(mp3_folder, exist_ok=True)




# %%
for ms_file in ms_files:
    export_mp3s(ms_file, mp3_folder)

# %%
