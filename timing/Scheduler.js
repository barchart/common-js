var _ = require('lodash');
var log4js = require('log4js');
var when = require('when');

var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');

module.exports = function() {
    'use strict';

    var logger = log4js.getLogger('common/timing/Scheduler');

    var Scheduler = Disposable.extend({
        init: function() {
            this._super();

            this._timeoutBindings = { };
            this._intervalBindings = { };
        },

        schedule: function(actionToSchedule, millisecondDelay, actionDescription) {
            assert.argumentIsRequired(actionToSchedule, 'actionToSchedule', Function);
            assert.argumentIsRequired(millisecondDelay, 'millisecondDelay', Number);
            assert.argumentIsOptional(actionDescription, 'actionDescription', String);

            if (this.getIsDisposed()) {
                throw new Error('The Scheduler has been disposed.');
            }

            var that = this;

            var token = null;

            var defer = when.defer();

            var wrappedAction = function() {
                try {
                    delete that._timeoutBindings[token];

                    defer.resolve(actionToSchedule());
                } catch (e) {
                    logger.error('A scheduled action (' + (actionDescription || 'with no description') + ') threw an unhandled error', e);

                    defer.reject(e);
                }
            };

            token = setTimeout(wrappedAction, millisecondDelay);

            var timeoutBinding = Disposable.fromAction(function() {
                clearTimeout(token);

                delete that._timeoutBindings[token];
            });

            that._timeoutBindings[token] = timeoutBinding;

            return defer.promise;
        },

        repeat: function(actionToRepeat, millisecondInterval, actionDescription) {
            assert.argumentIsRequired(actionToRepeat, 'actionToRepeat', Function);
            assert.argumentIsRequired(millisecondInterval, 'millisecondInterval', Number);
            assert.argumentIsOptional(actionDescription, 'actionDescription', String);

            if (this.getIsDisposed()) {
                throw new Error('The Scheduler has been disposed.');
            }

            var that = this;

            var token = null;

            var wrappedAction = function() {
                try {
                    actionToRepeat();
                } catch (e) {
                    logger.error('A repeating action (' + (actionDescription || 'with no description') + ') threw an unhandled error', e);
                }
            };

            token = setInterval(wrappedAction, millisecondInterval);

            var intervalBinding = Disposable.fromAction(function() {
                clearInterval(token);

                delete that._intervalBindings[token];
            });

            that._intervalBindings[token] = intervalBinding;

            return intervalBinding;
        },

        backoff: function(actionToBackoff, millisecondDelay, actionDescription, maximumAttempts) {
            assert.argumentIsRequired(actionToBackoff, 'actionToBackoff', Function);
            assert.argumentIsOptional(millisecondDelay, 'millisecondDelay', Number);
            assert.argumentIsOptional(actionDescription, 'actionDescription', String);
            assert.argumentIsOptional(maximumAttempts, 'maximumAttempts', Number);

            if (this.getIsDisposed()) {
                throw new Error('The Scheduler has been disposed.');
            }

            var that = this;

            var scheduleBackoff = function(failureCount) {
                if (maximumAttempts > 0 && failureCount > maximumAttempts) {
                    logger.warn('An backoff action (' + (actionDescription || 'with no description') + ') has been permanently aborted');

                    return when.reject();
                }

                var backoffDelay = millisecondDelay * Math.pow(2, failureCount);

                if (failureCount > 0) {
                    logger.warn('An backoff action (' + (actionDescription || 'with no description') + ') will be retried in ' + backoffDelay + ' milliseconds');
                }

                return that.schedule(actionToBackoff, backoffDelay, (actionDescription || 'unspecified') + ', attempt ' + (failureCount + 1))
                    .then(function(result) {
                        if (result) {
                            return when(result);
                        } else {
                            return scheduleBackoff(++failureCount);
                        }
                    })
                    .catch(function(e) {
                        return scheduleBackoff(++failureCount);
                    });
            };

            return scheduleBackoff(0);
        },

        _onDispose: function() {
            _.forEach(_.values(this._timeoutBindings), function(timeoutBinding) {
                timeoutBinding.dispose();
            });

            _.forEach(_.values(this._intervalBindings), function(intervalBinding) {
                intervalBinding.dispose();
            });

            this._timeoutBindings = null;
            this._intervalBindings = null;
        },

        toString: function() {
            return '[Scheduler]';
        }
    });

    return Scheduler;
}();