/**
 * Created by jhoon80.park on 2016-04-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function GoHistoryCommand(options) {
        this.options = $.extend({}, options.options);
        this.options.commands = options.commands;
    }

    GoHistoryCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.gohistorycommand';
    };

    GoHistoryCommand.prototype.getLabel = function () {
        return 'Go History';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.GoHistoryCommand = GoHistoryCommand;

}).call(this);