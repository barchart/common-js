var _ = require('lodash');

var common = require('./common/index');
var lang = require('./lang/index');

module.exports = function() {
    'use strict';

    return {
        Common: _.merge(common, lang)
    };
}();