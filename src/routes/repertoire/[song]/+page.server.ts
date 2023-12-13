import { s3, generatePresignedUrl, getObjects, getSubpaths } from '$lib/server/s3';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	const songName = params.song;
	const fileObjects = await getObjects(s3, 'tuwienchor', `mp3s/${songName}`);
	const tracks = await Promise.all(
		fileObjects.map((object) =>
			generatePresignedUrl('tuwienchor', object.Key!, 60 * 60).then((url) => {
				const filename = object.Key!.split('/').pop()!;
				return {
					filename,
					url
				};
			})
		)
	);

	const allSongs = await getSubpaths(s3, 'tuwienchor', 'mp3s/');
	const songIndex = allSongs.indexOf(songName);
	const nextSong = songIndex < allSongs.length - 1 ? allSongs[songIndex + 1]! : null;
	const previousSong = songIndex > 0 ? allSongs[songIndex - 1]! : null;

	return { tracks, songName, nextSong, previousSong };
}
