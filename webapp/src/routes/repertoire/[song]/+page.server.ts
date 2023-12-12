import { s3, generatePresignedUrl, getObjects } from '$lib/server/s3';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	const songName = params.song;
	const fileObjects = await getObjects(s3, 'tuwienchor', `mp3s/${songName}`);
	const tracks = Promise.all(
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

	return { tracks, songName };
}
