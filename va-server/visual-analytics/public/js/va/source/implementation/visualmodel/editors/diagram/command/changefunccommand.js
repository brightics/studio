/**
 * Created by daewon.park on 2016-03-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeFuncCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.scheduleLinks = options.scheduleLinks || [];
    }

    ChangeFuncCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeFuncCommand.prototype.constructor = ChangeFuncCommand;

    ChangeFuncCommand.prototype.execute = function () {
        var dataSourceId = this.options.dataSourceId,
            newFunc = this.options.func;

        var dataSource = this.options.analyticsModel.getDataSource(dataSourceId);
        this.old.func = dataSource.func;
        this.options.analyticsModel.changeFunc(dataSourceId, newFunc);
    };

    ChangeFuncCommand.prototype.undo = function () {
        this.options.analyticsModel.changeFunc(this.options.dataSourceId, this.old.func);
    };

    ChangeFuncCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.ChangeFuncCommand';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeFuncCommand = ChangeFuncCommand;

}).call(this);