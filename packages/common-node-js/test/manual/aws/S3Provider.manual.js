const { Readable } = require('stream');

const S3Provider = require('../../../aws/S3Provider');
const utils = require('../utils/ManualTestUtils');

utils.run('S3Provider manual test', async () => {
	const bucket = utils.requireEnv('S3_TEST_BUCKET');
	const folder = utils.env('S3_TEST_FOLDER', 'common-node-js-manual');

	const provider = new S3Provider({ region: utils.region(), bucket, folder });
	const keyPrefix = S3Provider.getQualifiedFilename(folder, `manual-${Date.now()}`);

	const key = `${keyPrefix}/object.json`;
	const streamKey = `${keyPrefix}/stream.txt`;

	const started = await provider.start();
	utils.assertEqual(started, true, 'S3 provider should start');

	console.log('Configuration:', provider.getConfiguration());

	const qualifiedFilename = S3Provider.getQualifiedFilename('/a/', '\\b\\', 'c');

	console.log('Qualified filename:', qualifiedFilename);

	utils.assertEqual(qualifiedFilename, 'a/b/c', 'getQualifiedFilename should normalize path components');

	try {
		utils.assertObject(await utils.step('upload', () => provider.upload('upload.txt', 'hello from upload', 'text/plain', 'none')), 'upload should return wrapper object');
		utils.assertObject(await utils.step('uploadObject', () => provider.uploadObject(bucket, key, { ok: true, createdAt: new Date().toISOString() }, 'application/json', 'none')), 'uploadObject should return wrapper object');
		utils.assertObject(await utils.step('uploadStream', () => provider.uploadStream(bucket, streamKey, Readable.from(['stream body']))), 'uploadStream should return AWS response object');

		const metadata = await utils.step('getMetadata', () => provider.getMetadata('upload.txt'));
		utils.assertEqual(metadata.data.ContentType, 'text/plain', 'getMetadata should return uploaded content type');

		const objectMetadata = await utils.step('getMetadataObject', () => provider.getMetadataObject(bucket, key));
		utils.assertEqual(objectMetadata.data.ContentType, 'application/json', 'getMetadataObject should return uploaded object content type');

		const downloaded = await utils.step('download', () => provider.download('upload.txt'));
		utils.assertEqual(downloaded, 'hello from upload', 'download should return uploaded text');

		const downloadedObject = await utils.step('downloadObject', () => provider.downloadObject(bucket, key));
		utils.assertEqual(downloadedObject.ok, true, 'downloadObject should parse uploaded JSON');

		const streamBody = await utils.step('createReadStream', async () => {
			const stream = await provider.createReadStream(bucket, streamKey);
			const chunks = [];

			for await (const chunk of stream) {
				chunks.push(Buffer.from(chunk));
			}

			return Buffer.concat(chunks).toString('utf8');
		});
		utils.assertEqual(streamBody, 'stream body', 'createReadStream should read uploaded stream content');

		const contents = await utils.step('getBucketContents', () => provider.getBucketContents(keyPrefix, bucket));
		utils.assert(contents.some(item => item.key === key), 'getBucketContents should include uploaded object');

		const signedUrl = await utils.step('getSignedUrl getObject', () => provider.getSignedUrl('getObject', S3Provider.getQualifiedFilename(folder, 'upload.txt'), 60));
		utils.assertString(signedUrl, 'getSignedUrl should return URL string');
	} finally {
		await utils.pauseBeforeCleanup(`Inspect S3 objects under [ s3://${bucket}/${keyPrefix} ], then press Enter to cleanup.`);

		await utils.cleanup('delete upload.txt', () => provider.deleteObject(bucket, S3Provider.getQualifiedFilename(folder, 'upload.txt')));
		await utils.cleanup('delete object.json', () => provider.deleteObject(bucket, key));
		await utils.cleanup('delete stream.txt', () => provider.deleteObject(bucket, streamKey));
	}
});
