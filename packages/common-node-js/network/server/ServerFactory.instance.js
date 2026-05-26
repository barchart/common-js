const ExpressServerFactory = require('./express/ExpressServerFactory');

module.exports = (() => {
	'use strict';

	return new ExpressServerFactory();
})();