import DataOperation from './../../../engine/DataOperation.js';
import DataOperationAdjustment from './../../../engine/DataOperationAdjustment.js';
import DataOperationComparators from './../../../engine/DataOperationComparators.js';
import DataOperationContainer from './../../../engine/DataOperationContainer.js';
import DataOperationResult from './../../../engine/DataOperationResult.js';
import DataOperationStage from './../../../engine/DataOperationStage.js';
import DataProvider from './../../../engine/DataProvider.js';
import DataSession from './../../../engine/DataSession.js';
import DataSessionFactory from './../../../engine/DataSessionFactory.js';

class TestOperation extends DataOperation {
	constructor(id, result, options) {
		super();

		this.id = id;
		this.result = result;
		this.options = options || { };
	}

	get stage() {
		return this.options.stage || DataOperationStage.PROCESS;
	}

	get adjustment() {
		return this.options.adjustment || DataOperationAdjustment.NONE;
	}

	async _process(dataProvider, session, name) {
		if (this.options.trace) {
			this.options.trace.push(this.id);
		}

		if (this.options.child) {
			this._spawn(this.options.child, this.options.childStage, this.options.childAdjustment);
		}

		return {
			id: this.id,
			result: this.result,
			options: dataProvider.getOptions(),
			session,
			name
		};
	}

	_transformResult(currentResult, spawnResults) {
		if (this.options.includeSpawnResults) {
			return Object.assign({ }, currentResult, {
				spawnResults
			});
		}

		return currentResult;
	}

	_equals(other) {
		return other instanceof TestOperation && other.id === this.id;
	}
}

class TestSessionFactory extends DataSessionFactory {
	constructor() {
		super();

		this.starts = 0;
	}

	_start() {
		this.starts = this.starts + 1;
	}

	_getSession() {
		return new DataSession();
	}

	_getDataProvider(options) {
		return new DataProvider(options);
	}
}

describe('When data engine primitives are used', () => {
	'use strict';

	it('should expose provider options and operation result values', () => {
		const provider = new DataProvider({ account: 'A1' });
		const operation = new TestOperation('read', 'ok');
		const child = new TestOperation('child', 'child');
		const result = new DataOperationResult(operation, 'ok', [ child ]);

		expect({
			options: provider.getOptions(),
			operation: result.operation,
			result: result.result,
			children: result.children,
			initial: DataOperationResult.getInitial()
		}).toEqual({
			options: { account: 'A1' },
			operation,
			result: 'ok',
			children: [ child ],
			initial: jasmine.objectContaining({
				operation: null,
				result: null,
				children: [ ]
			})
		});
	});

	it('should store and update operation container metadata', () => {
		const operation = new TestOperation('read', 'ok');
		const container = new DataOperationContainer(operation, DataOperationStage.SAVE, DataOperationAdjustment.DEFER, 5);

		container.stage = DataOperationStage.PROCESS;
		container.adjustment = DataOperationAdjustment.PRIORITIZE;
		container.order = 10;

		expect({
			operation: container.operation,
			stage: container.stage,
			adjustment: container.adjustment,
			order: container.order
		}).toEqual({
			operation,
			stage: DataOperationStage.PROCESS,
			adjustment: DataOperationAdjustment.PRIORITIZE,
			order: 10
		});
	});

	it('should process operations and return spawned child containers', async () => {
		const child = new TestOperation('child', 'child');
		const operation = new TestOperation('parent', 'parent', {
			child,
			childStage: DataOperationStage.FINALIZE,
			childAdjustment: DataOperationAdjustment.DEFER
		});

		const result = await operation.process(new DataProvider({ source: 'memory' }), 'S1', 'session');

		expect({
			result: result.result,
			childCount: result.children.length,
			childOperation: result.children[0].operation,
			childStage: result.children[0].stage,
			childAdjustment: result.children[0].adjustment,
			equalsSelf: operation.equals(operation),
			equalsDuplicate: operation.equals(new TestOperation('parent', 'other'))
		}).toEqual({
			result: {
				id: 'parent',
				result: 'parent',
				options: { source: 'memory' },
				session: 'S1',
				name: 'session'
			},
			childCount: 1,
			childOperation: child,
			childStage: DataOperationStage.FINALIZE,
			childAdjustment: DataOperationAdjustment.DEFER,
			equalsSelf: true,
			equalsDuplicate: true
		});
	});

	it('should reject repeated processing of the same operation instance', async () => {
		const operation = new TestOperation('read', 'ok');

		await operation.process(new DataProvider(), 'S1', null);

		await expectAsync(operation.process(new DataProvider(), 'S2', null)).toBeRejected();
	});

	it('should compare operation containers by stage, adjustment, and enqueue order', () => {
		const containers = [
			new DataOperationContainer(new TestOperation('save', 'save'), DataOperationStage.SAVE, DataOperationAdjustment.NONE, 1),
			new DataOperationContainer(new TestOperation('process-defer', 'process-defer'), DataOperationStage.PROCESS, DataOperationAdjustment.DEFER, 1),
			new DataOperationContainer(new TestOperation('process-first', 'process-first'), DataOperationStage.PROCESS, DataOperationAdjustment.PRIORITIZE, 2),
			new DataOperationContainer(new TestOperation('process-second', 'process-second'), DataOperationStage.PROCESS, DataOperationAdjustment.PRIORITIZE, 3)
		];

		containers.sort(DataOperationComparators.DEFAULT);

		expect(containers.map(container => container.operation.id)).toEqual([
			'process-first',
			'process-second',
			'process-defer',
			'save'
		]);
	});

	it('should flush sessions by priority and return user-enqueued results', async () => {
		const trace = [ ];
		const first = new TestOperation('save', 'save', {
			stage: DataOperationStage.SAVE,
			trace
		});
		const second = new TestOperation('process', 'process', {
			stage: DataOperationStage.PROCESS,
			trace
		});
		const session = new DataSession().withName('quotes');

		session
			.withOperation(first)
			.withOperation(second);

		const output = await session.flush(new DataProvider({ source: 'memory' }));

		expect({
			name: session.name,
			trace,
			output: output.map(item => item.id)
		}).toEqual({
			name: 'quotes',
			trace: [ 'process', 'save' ],
			output: [ 'save', 'process' ]
		});
	});

	it('should transform parent results with spawned operation results', async () => {
		const child = new TestOperation('child', 'child');
		const parent = new TestOperation('parent', 'parent', {
			child,
			includeSpawnResults: true
		});
		const session = new DataSession();

		session.withOperation(parent);

		const output = await session.flush(new DataProvider());

		expect({
			id: output.id,
			spawnResults: output.spawnResults.map(result => result.id)
		}).toEqual({
			id: 'parent',
			spawnResults: [ 'child' ]
		});
	});

	it('should start a session factory once and flush callback operations', async () => {
		const factory = new TestSessionFactory();

		await factory.start();
		await factory.start();

		const output = await factory.startSession((session) => {
			session.withOperation(new TestOperation('read', 'ok'));
		}, { source: 'memory' });

		expect({
			starts: factory.starts,
			output
		}).toEqual({
			starts: 1,
			output: {
				id: 'read',
				result: 'ok',
				options: { source: 'memory' },
				session: jasmine.any(String),
				name: null
			}
		});
	});
});
