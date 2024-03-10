import { type BucketName, bucketRegions } from '$lib/globals/s3';
import { getS3Client } from '$lib/server/s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

/**
 * Gets the subfolders (direct children) of a bucket or a folder in a bucket.
 *
 * Actually, it gets the "CommonPrefixes" of the items in a bucket with an optional prefix (using '/' as the delimiter) as strictly speaking, S3 does not have a concept of 'folders'.
 *
 * @param bucket
 * @param folder
 * @returns
 */
export async function getBucketSubfolders(bucket: BucketName, folder?: string) {
	const s3 = getS3Client(bucketRegions[bucket]);

	try {
		// Call S3 to list objects in the bucket
		const command = new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: folder,
			Delimiter: '/', // This will make S3 return only folders (i.e. paths until first '/')
			// if a lot of files are in the directory, we need to set MaxKeys to a higher value to get all the 'folders' as well
			MaxKeys: 10000
		});
		const response = await s3.send(command);

		if (response.CommonPrefixes) {
			const folders = response.CommonPrefixes.map((commonPrefix) => commonPrefix.Prefix);
			return folders;
		} else {
			return [];
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
