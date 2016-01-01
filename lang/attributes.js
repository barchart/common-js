var _ = require('lodash');

var assert = require('./assert');

module.exports = function() {
    'use strict';

    var attributes = {
        has: function(target, propertyNames) {
            assert.argumentIsRequired(target, 'target', Object);
            assert.argumentIsRequired(propertyNames, 'propertyNames', String);

            var propertyNameArray = getPropertyNameArray(propertyNames);
            var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

            return propertyTarget !== null && _.has(propertyTarget, _.last(propertyNameArray));
        },

        read: function(target, propertyNames) {
            assert.argumentIsRequired(target, 'target', Object);
            assert.argumentIsRequired(propertyNames, 'propertyNames', String);

            var propertyNameArray = getPropertyNameArray(propertyNames);
            var propertyTarget = getPropertyTarget(target, propertyNameArray, false);

            var returnRef;

            if (propertyTarget) {
                var propertyName = _.last(propertyNameArray);

                returnRef = propertyTarget[propertyName];
            } else {
                returnRef = undefined;
            }

            return returnRef;
        },

        write: function(target, propertyNames, value) {
            assert.argumentIsRequired(target, 'target', Object);
            assert.argumentIsRequired(propertyNames, 'propertyNames', String);

            var propertyNameArray = getPropertyNameArray(propertyNames);
            var propertyTarget = getPropertyTarget(target, propertyNameArray, true);

            var propertyName = _.last(propertyNameArray);

            propertyTarget[propertyName] = value;
        }
    };

    function getPropertyNameArray(propertyNames) {
        return propertyNames.split('.');
    }

    function getPropertyTarget(target, propertyNameArray, create) {
        var returnRef;

        var propertyTarget = target;

        for (var i = 0; i < (propertyNameArray.length - 1); i++) {
            var propertyName = propertyNameArray[i];

            if (_.has(propertyTarget, propertyName)) {
                propertyTarget = propertyTarget[propertyName];
            } else if (create) {
                propertyTarget = propertyTarget[propertyName] = { };
            } else {
                propertyTarget = null;

                break;
            }
        }

        return propertyTarget;
    }

    return attributes;
}();