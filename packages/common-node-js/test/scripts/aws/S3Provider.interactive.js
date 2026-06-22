import * as assert from '@barchart/common-js/lang/assert.js';
import * as utils from '../utils/InteractiveTestUtils.js';

import S3Provider from '../../../aws/S3Provider.js';

import { Readable } from 'stream';

utils.run('S3Provider interactive test', async () => {
	const bucket = utils.requireEnv('S3_TEST_BUCKET');
	const folder = utils.env('S3_TEST_FOLDER', 'common-node-js-interactive');

	const provider = new S3Provider({ region: utils.region(), bucket, folder });
	const keyPrefix = S3Provider.getQualifiedFilename(folder, `interactive-${Date.now()}`);

	const key = `${keyPrefix}/object.json`;
	const streamKey = `${keyPrefix}/stream.txt`;

	const started = await provider.start();
	assert.areEqual(started, true, 'S3 provider should start');

	console.log('Configuration:', provider.getConfiguration());

	const qualifiedFilename = S3Provider.getQualifiedFilename('/a/', '\\b\\', 'c');

	console.log('Qualified filename:', qualifiedFilename);

	assert.areEqual(qualifiedFilename, 'a/b/c', 'getQualifiedFilename should normalize path components');

	try {
		assert.argumentIsValid(await utils.step('upload', () => provider.upload('upload.txt', 'hello from upload', 'text/plain', 'none')), 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'upload should return wrapper object');
		assert.argumentIsValid(await utils.step('uploadObject', () => provider.uploadObject(bucket, key, { ok: true, createdAt: new Date().toISOString() }, 'application/json', 'none')), 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'uploadObject should return wrapper object');
		assert.argumentIsValid(await utils.step('uploadStream', () => provider.uploadStream(bucket, streamKey, Readable.from(['stream body']))), 'value', value => value !== null && typeof value === 'object' && !Array.isArray(value), 'uploadStream should return AWS response object');

		const metadata = await utils.step('getMetadata', () => provider.getMetadata('upload.txt'));
		assert.areEqual(metadata.data.ContentType, 'text/plain', 'getMetadata should return uploaded content type');

		const objectMetadata = await utils.step('getMetadataObject', () => provider.getMetadataObject(bucket, key));
		assert.areEqual(objectMetadata.data.ContentType, 'application/json', 'getMetadataObject should return uploaded object content type');

		const downloaded = await utils.step('download', () => provider.download('upload.txt'));
		assert.areEqual(downloaded, 'hello from upload', 'download should return uploaded text');

		const downloadedObject = await utils.step('downloadObject', () => provider.downloadObject(bucket, key));
		assert.areEqual(downloadedObject.ok, true, 'downloadObject should parse uploaded JSON');

		const streamBody = await utils.step('createReadStream', async () => {
			const stream = await provider.createReadStream(bucket, streamKey);
			const chunks = [ ];

			for await (const chunk of stream) {
				chunks.push(Buffer.from(chunk));
			}

			return Buffer.concat(chunks).toString('utf8');
		});
		assert.areEqual(streamBody, 'stream body', 'createReadStream should read uploaded stream content');

		const contents = await utils.step('getBucketContents', () => provider.getBucketContents(keyPrefix, bucket));
		assert.argumentIsValid(contents.some(item => item.key === key), 'condition', value => value === true, 'getBucketContents should include uploaded object');

		const signedUrl = await utils.step('getSignedUrl getObject', () => provider.getSignedUrl('getObject', S3Provider.getQualifiedFilename(folder, 'upload.txt'), 60));
		assert.argumentIsValid(signedUrl, 'value', value => typeof value === 'string' && value.length > 0, 'getSignedUrl should return URL string');
	} finally {
		await utils.pauseBeforeCleanup(`Inspect S3 objects under [ s3://${bucket}/${keyPrefix} ], then press Enter to cleanup.`);

		await utils.cleanup('delete upload.txt', () => provider.deleteObject(bucket, S3Provider.getQualifiedFilename(folder, 'upload.txt')));
		await utils.cleanup('delete object.json', () => provider.deleteObject(bucket, key));
		await utils.cleanup('delete stream.txt', () => provider.deleteObject(bucket, streamKey));
	}
});
