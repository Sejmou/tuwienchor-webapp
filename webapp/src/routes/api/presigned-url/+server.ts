import { json, error } from '@sveltejs/kit';
import { generatePresignedUrl } from '$lib/server/s3/presigned-urls';
import type { RequestHandler } from './$types';

type CachedURLData = {
	url: string;
	expires: number;
};

const cachedUrls: Record<string, CachedURLData> = {};

export const GET: RequestHandler = async ({ url }) => {
	const bucket = url.searchParams.get('bucket');
	const key = url.searchParams.get('key');

	if (typeof bucket !== 'string' || typeof key !== 'string') {
		return error(400, { message: 'Please provide a bucket and key' });
	}

	const cacheKey = `${bucket}/${key}`;
	const cached = cachedUrls[cacheKey];

	const tenMinsInFuture = Date.now() + 10 * 60 * 1000;
	if (cached && cached.expires > tenMinsInFuture) {
		return json({
			url: cached.url
		});
	}

	const anHourInSeconds = 60 * 60;
	const presignedUrl = await generatePresignedUrl(bucket, key, anHourInSeconds);

	cachedUrls[cacheKey] = {
		url: presignedUrl,
		expires: Date.now() + anHourInSeconds
	};

	return json({
		url: presignedUrl
	});
};
