import { getDynamicEnvVar } from '$lib/server/dynamic-env';
import { S3Client } from '@aws-sdk/client-s3';

function getS3Client(region: 'eu-central-1' | 'eu-central-2' = 'eu-central-2') {
	const accessKeyId = getDynamicEnvVar('S3_KEY_ID');
	const secretAccessKey = getDynamicEnvVar('S3_SECRET');

	const s3 = new S3Client({
		// apparently, we need to set the endpoint to the Wasabi endpoint for the region..
		endpoint: `https://s3.${region}.wasabisys.com`,
		// ... and specify the region once more here too
		region,
		credentials: {
			accessKeyId,
			secretAccessKey
		}
	});
	return s3;
}

export const s3 = getS3Client();
