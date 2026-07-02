import Tree from '@barchart/common-js/collections/Tree.js';

import ArrayReadStream from './../../../stream/ArrayReadStream.js';
import DelegateReadStream from './../../../stream/DelegateReadStream.js';
import DelegateWriteStream from './../../../stream/DelegateWriteStream.js';
import EmptyWriteStream from './../../../stream/EmptyWriteStream.js';
import GroupTransformer from './../../../stream/GroupTransformer.js';
import PartitionTransformer from './../../../stream/PartitionTransformer.js';
import SplitTransformer from './../../../stream/SplitTransformer.js';
import StringReadStream from './../../../stream/StringReadStream.js';
import TreeReadStream from './../../../stream/TreeReadStream.js';

async function collect(readable) {
	return new Promise((resolve, reject) => {
		const items = [ ];

		readable.on('data', item => items.push(item));
		readable.on('error', reject);
		readable.on('end', () => resolve(items));
	});
}

async function writeAll(writable, items) {
	return new Promise((resolve, reject) => {
		writable.on('error', reject);
		writable.on('finish', resolve);

		items.forEach(item => writable.write(item));
		writable.end();
	});
}

describe('When common stream utilities are used', () => {
	'use strict';

	it('should read arrays and strings from memory', async () => {
		expect({
			array: await collect(new ArrayReadStream([ 1, 2, 3 ])),
			string: await collect(new StringReadStream('hello'))
		}).toEqual({
			array: [ 1, 2, 3 ],
			string: [ 'hello' ]
		});
	});

	it('should read tree nodes in parent-first order', async () => {
		const root = new Tree('root');
		const left = root.addChild('left');

		left.addChild('left.child');
		root.addChild('right');

		const nodes = await collect(new TreeReadStream(root));

		expect(nodes.map(node => node.getValue())).toEqual([
			'root',
			'left',
			'left.child',
			'right'
		]);
	});

	it('should read delegated batches and expose progress state', async () => {
		const batches = [
			[ 1, 2 ],
			[ 3 ],
			null
		];
		const stream = new DelegateReadStream(async () => batches.shift());

		const items = await collect(stream);

		expect({
			items,
			scanned: stream.scanned,
			completed: stream.completed,
			stopping: stream.stopping
		}).toEqual({
			items: [
				[ 1, 2 ],
				[ 3 ]
			],
			scanned: 3,
			completed: true,
			stopping: false
		});
	});

	it('should read delegated items discretely', async () => {
		const batches = [
			[ 1, 2 ],
			null
		];
		const stream = new DelegateReadStream(async () => batches.shift(), 10, true);

		expect(await collect(stream)).toEqual([ 1, 2 ]);
	});

	it('should write with synchronous and asynchronous delegates', async () => {
		const synchronousItems = [ ];
		const asynchronousItems = [ ];

		await writeAll(new DelegateWriteStream(item => synchronousItems.push(item)), [ 1, 2 ]);
		await writeAll(new DelegateWriteStream(async item => asynchronousItems.push(item), null, true), [ 3, 4 ]);

		expect({
			synchronousItems,
			asynchronousItems
		}).toEqual({
			synchronousItems: [ 1, 2 ],
			asynchronousItems: [ 3, 4 ]
		});
	});

	it('should count writes sent to an empty write stream', async () => {
		const writable = new EmptyWriteStream();

		await writeAll(writable, [ 1, 2, 3 ]);

		expect(writable.count).toEqual(3);
	});

	it('should split arrays into individual items', async () => {
		const readable = new ArrayReadStream([
			[ 1, 2 ],
			[ 3 ]
		]);

		expect(await collect(readable.pipe(new SplitTransformer()))).toEqual([ 1, 2, 3 ]);
	});

	it('should partition arrays into fixed-size chunks', async () => {
		const readable = new ArrayReadStream([
			[ 1, 2, 3, 4, 5 ]
		]);

		expect(await collect(readable.pipe(new PartitionTransformer(2)))).toEqual([
			[ 1, 2 ],
			[ 3, 4 ],
			[ 5 ]
		]);
	});

	it('should group adjacent objects by selected key', async () => {
		const readable = new ArrayReadStream([
			{ symbol: 'AAPL', value: 1 },
			{ symbol: 'AAPL', value: 2 },
			{ symbol: 'MSFT', value: 3 }
		]);

		expect(await collect(readable.pipe(new GroupTransformer(item => item.symbol)))).toEqual([
			[
				{ symbol: 'AAPL', value: 1 },
				{ symbol: 'AAPL', value: 2 }
			],
			[
				{ symbol: 'MSFT', value: 3 }
			]
		]);
	});
});
