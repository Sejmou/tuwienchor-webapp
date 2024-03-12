import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { songs } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const songId = params.songId;
	// check if songId is a valid UUID
	if (!songId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)) {
		return error(404, 'Song not found');
	}
	const song = await db.select().from(songs).where(eq(songs.id, songId));

	if (song.length === 0) {
		return error(404, 'Song not found');
	}

	return {
		song: song[0]!
	};
};
