const Enum = require('@barchart/common-js/lang/Enum');

const EnumSerializer = require('./../../../../../../../aws/dynamo/schema/serialization/attributes/EnumSerializer');

describe('When a EnumSerializer is instantiated (for a MotorcycleType enum)', () => {
	'use strict';

	class MotorcycleType extends Enum {
		constructor(code, description) {
			super(code, description);
		}

		static get CHOPPER() {
			return chopper;
		}

		static get TOURING() {
			return touring;
		}
	}

	const chopper = new MotorcycleType('CH', 'Chopper');
	const touring = new MotorcycleType('T', 'Touring');

	let serializer;

	beforeEach(() => {
		serializer = new EnumSerializer(MotorcycleType);
	});

	it('it serializes a MotorcycleType.CHOPPER as { S: "CH" } }', () => {
		let serialized = serializer.serialize(MotorcycleType.CHOPPER);

		expect(serialized.S).toEqual('CH');
	});

	it('it deserializes { S: "CH" } as MotorcycleType.CHOPPER', () => {
		let deserialized = serializer.deserialize({ S: 'CH' });

		expect(deserialized).toBe(MotorcycleType.CHOPPER);
	});
});