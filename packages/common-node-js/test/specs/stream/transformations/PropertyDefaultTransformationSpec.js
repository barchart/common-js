const PropertyDefaultTransformation = require('./../../../../stream/transformations/PropertyDefaultTransformation');

describe('When a PropertyDefaultTransformation is created', () => {
	'use strict';

	describe('targeting the "zip" property (with a default value of "60606"', () => {
		let transformation;

		beforeEach(() => {
			transformation = new PropertyDefaultTransformation('60606', 'zip');
		});

		it('should not replace an existing zip property value', () => {
			expect(transformation.transform({ "zip": '60603' }).zip).toEqual('60603');
		});

		it('should replace the existing zip property value (if the value is undefined)', () => {
			expect(transformation.transform({ "zip": undefined }).zip).toEqual('60606');
		});

		it('should add the zip property if it does not exist', () => {
			expect(transformation.transform({ }).zip).toEqual('60606');
		});
	});
});