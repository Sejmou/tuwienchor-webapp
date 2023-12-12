import { env } from '$env/dynamic/private';
import AWS from 'aws-sdk';

export const s3 = new AWS.S3({
	accessKeyId: env.AWS_ACCESS_KEY_ID,
	secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	region: env.AWS_REGION,
	endpoint: env.AWS_ENDPOINT
});

export function getObjects(s3: AWS.S3, bucketName: string, prefix?: string) {
	const params = {
		Bucket: bucketName,
		Prefix: prefix || ''
	};

	return new Promise<AWS.S3.Object[]>((resolve, reject) => {
		s3.listObjectsV2(params, (err, data) => {
			if (err) {
				console.error('Error listing objects:', err);
				reject();
			}

			if (!data) {
				throw new Error('No data returned from S3');
			}

			if (!data.Contents) {
				return resolve([]);
			}

			return resolve(data.Contents);
		});
	});
}

export async function getSubpaths(s3: AWS.S3, bucketName: string, prefix?: string) {
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
		Key: key,
		Expires: expirationTimeSeconds
	};

	return s3.getSignedUrlPromise('getObject', params);
}
