/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Command(eventSource, options) {
        this.event = {
            source: eventSource,
            type: ''
        };
        this.options = options && $.extend({undoable: true}, options) || {undoable: true};
        this.old = {};
        this.FnUnitUtils = brtc_require('FnUnitUtils');
    }

    Command.prototype.canUndo = function () {
        return true;
    };

    Command.prototype.canRedo = function () {
        return true;
    };

    Command.prototype.execute = function () {

    };

    Command.prototype.undo = function () {

    };

    Command.prototype.redo = function () {
        this.execute();
    };

    Command.prototype.getId = function () {
        return 'brightics.va.command';
    };

    Command.prototype.getLabel = function () {
        return this.options.label || '';
    };

    Command.prototype.getMainModel = function () {
        return this.options.mainModel;
    };

    Command.prototype.getTargetModel = function () {
        return this.options.analyticsModel;
    };

    Command.prototype.getActiveModel = function () {
        return Studio.getActiveEditor().getActiveModel();
    }

    Brightics.VA.Core.Command = Command;

}).call(this);