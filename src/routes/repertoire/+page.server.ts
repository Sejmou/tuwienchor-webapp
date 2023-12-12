import { s3, getSubpaths } from '$lib/server/s3';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const subpaths = await getSubpaths(s3, 'tuwienchor', 'mp3s/');
	return { songs: subpaths };
}
