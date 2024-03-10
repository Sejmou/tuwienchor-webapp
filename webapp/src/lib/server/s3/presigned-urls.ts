import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '.';

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
