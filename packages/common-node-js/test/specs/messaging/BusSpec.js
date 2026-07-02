import Bus from './../../../messaging/Bus.js';
import CompositePublisher from './../../../messaging/publishers/CompositePublisher.js';
import LocalPublisher from './../../../messaging/publishers/LocalPublisher.js';
import CompositeRouter from './../../../messaging/routers/CompositeRouter.js';
import LocalRouter from './../../../messaging/routers/LocalRouter.js';

describe('When local messaging components are used', () => {
	'use strict';

	it('should require bus startup before publishing', async () => {
		const bus = new Bus(new LocalPublisher(), new LocalRouter());

		await expectAsync(bus.publish('quote.updated', { })).toBeRejected();
	});

	it('should require bus startup before routing', async () => {
		const bus = new Bus(new LocalPublisher(), new LocalRouter());

		await expectAsync(bus.request('quote.read', { })).toBeRejected();
	});

	it('should publish local messages to subscribers', async () => {
		const publisher = new LocalPublisher();
		const bus = new Bus(publisher, new LocalRouter());
		const handler = jasmine.createSpy('handler');

		await bus.start();

		const subscription = await bus.subscribe('quote.updated', handler);

		await bus.publish('quote.updated', { symbol: 'AAPL' });

		expect(handler).toHaveBeenCalledWith({ symbol: 'AAPL' });

		subscription.dispose();
		bus.dispose();
	});

	it('should unregister local subscriptions', async () => {
		const bus = new Bus(new LocalPublisher(), new LocalRouter());
		const handler = jasmine.createSpy('handler');

		await bus.start();

		const subscription = await bus.subscribe('quote.updated', handler);

		subscription.dispose();

		await bus.publish('quote.updated', { symbol: 'AAPL' });

		expect(handler).not.toHaveBeenCalled();

		bus.dispose();
	});

	it('should route local requests to registered handlers', async () => {
		const bus = new Bus(new LocalPublisher(), new LocalRouter());

		await bus.start();

		const registration = await bus.register('quote.read', (payload, messageType) => ({
			messageType,
			symbol: payload.symbol,
			price: 200
		}));

		const response = await bus.request('quote.read', { symbol: 'AAPL' }, 100);

		expect(response).toEqual({
			messageType: 'quote.read',
			symbol: 'AAPL',
			price: 200
		});

		registration.dispose();
		bus.dispose();
	});

	it('should return null for fire-and-forget local requests', async () => {
		const bus = new Bus(new LocalPublisher(), new LocalRouter());
		const handler = jasmine.createSpy('handler').and.returnValue({ ok: true });

		await bus.start();
		await bus.register('quote.read', handler);

		const response = await bus.request('quote.read', { symbol: 'AAPL' }, 100, true);

		expect({
			response,
			handler: handler.calls.argsFor(0)
		}).toEqual({
			response: null,
			handler: [ { symbol: 'AAPL' }, 'quote.read' ]
		});

		bus.dispose();
	});

	it('should suppress local publishing and routing by message type', async () => {
		const publisher = new LocalPublisher([ /^internal\./ ]);
		const router = new LocalRouter([ /^internal\./ ]);
		const bus = new Bus(publisher, router);
		const handler = jasmine.createSpy('handler');

		await bus.start();
		await bus.subscribe('internal.event', handler);
		await bus.publish('internal.event', { hidden: true });

		expect({
			published: handler.calls.count(),
			canRoute: router.canRoute('internal.request')
		}).toEqual({
			published: 0,
			canRoute: false
		});

		bus.dispose();
	});

	it('should publish and subscribe through composite publishers', async () => {
		const first = new LocalPublisher();
		const second = new LocalPublisher();
		const composite = new CompositePublisher([ first, second ]);
		const handler = jasmine.createSpy('handler');

		await composite.start();

		const subscription = await composite.subscribe('quote.updated', handler);

		await composite.publish('quote.updated', { symbol: 'AAPL' });

		expect(handler.calls.count()).toEqual(2);

		subscription.dispose();
		composite.dispose();
	});

	it('should route through the first composite router that can handle the message', async () => {
		const first = new LocalRouter();
		const second = new LocalRouter();
		const composite = new CompositeRouter([ first, second ]);

		await composite.start();

		await second.register('quote.read', payload => ({ symbol: payload.symbol }));

		expect({
			canRoute: composite.canRoute('quote.read'),
			response: await composite.route('quote.read', { symbol: 'AAPL' }, 100, false)
		}).toEqual({
			canRoute: true,
			response: {
				symbol: 'AAPL'
			}
		});

		composite.dispose();
	});
});
