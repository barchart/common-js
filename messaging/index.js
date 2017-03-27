const Event = require('./Event'),
	EventMap = require('./EventMap');

module.exports = (() => {
	'use strict';

	return {
		Event: Event,
		EventMap: EventMap
	};
})();