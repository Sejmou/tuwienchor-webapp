import { env } from '$env/dynamic/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';

export const s3 = new S3({
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY
	},

	region: env.AWS_REGION,

	// The transformation for endpoint is not implemented.
	// Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
	// Please create/upvote feature request on aws-sdk-js-codemod for endpoint.
	endpoint: env.AWS_ENDPOINT
});

export async function getObjects(s3: S3, bucketName: string, prefix?: string) {
	const params = {
		Bucket: bucketName,
		Prefix: prefix || ''
	};
	const result = await s3.listObjects(params);
	if (!result.Contents) {
		return [];
	}

	return result.Contents;
}

export async function getSubpaths(s3: S3, bucketName: string, prefix?: string) {
	// getObjects returns any object (with its associated 'path' or key) that starts with the prefix
	// however, we only want to extract the 'folder' names
	const objects = await getObjects(s3, bucketName, prefix);

	const level = prefix ? prefix.split('/').length - 1 : 0;

	const subfolders = Array.from(
		new Set(
			objects.map((object) => {
				const key = object.Key || '';
				const split = key.split('/');
				return split[level]!;
			})
		)
	).sort();

	return subfolders;
}

export function generatePresignedUrl(
	bucketName: string,
	key: string,
	expirationTimeSeconds: number
) {
	const params = {
		Bucket: bucketName,
		Key: key
	};

	return getSignedUrl(s3, new GetObjectCommand(params), {
		expiresIn: expirationTimeSeconds
	});
}
