/**
 * Created by daewon.park on 2016-03-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ChangeScheduleCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    ChangeScheduleCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ChangeScheduleCommand.prototype.constructor = ChangeScheduleCommand;

    ChangeScheduleCommand.prototype.execute = function () {
        var dataSourceId = this.options.dataSourceId,
            newScheduleId = this.options.scheduleId;

        var dataSource = this.options.analyticsModel.getDataSource(dataSourceId);
        this.old.scheduleId = dataSource.param.scheduleId || '';
        this.options.analyticsModel.changeSchedule(dataSourceId, newScheduleId);
    };

    ChangeScheduleCommand.prototype.undo = function () {
        this.options.analyticsModel.changeSchedule(this.options.dataSourceId, this.old.scheduleId);
    };

    ChangeScheduleCommand.prototype.getId = function () {
        return 'brightics.va.implementation.visual.editors.diagram.commands.ChangeScheduleCommand';
    };

    Brightics.VA.Implementation.Visual.Editors.Diagram.Commands.ChangeScheduleCommand = ChangeScheduleCommand;

}).call(this);