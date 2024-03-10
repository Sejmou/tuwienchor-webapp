import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3 } from '.';

export async function getFilenamesInBucket(bucket: string, prefix?: string) {
	try {
		// Call S3 to list objects in the bucket
		const command = new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: prefix,
			// if a lot of files are in the directory, we need to set MaxKeys to a higher value to get all the 'folders' as well
			MaxKeys: 10000
		});
		const response = await s3.send(command);

		if (response.Contents) {
			const files: string[] = [];
			for (const file of response.Contents) {
				if (file.Key) {
					const filename = file.Key.split('/').pop();
					if (filename) {
						files.push(filename);
					}
				}
			}
			return files;
		} else {
			return [];
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
