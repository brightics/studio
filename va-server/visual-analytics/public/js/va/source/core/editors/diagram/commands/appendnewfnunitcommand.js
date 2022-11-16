/**
 * Created by daewon.park on 2016-03-14.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      selectedId : ''
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function AppendNewFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.CompoundCommand.call(this, eventSource, options);
    }

    AppendNewFnUnitCommand.prototype = Object.create(Brightics.VA.Core.CompoundCommand.prototype);
    AppendNewFnUnitCommand.prototype.constructor = AppendNewFnUnitCommand;

    AppendNewFnUnitCommand.prototype.execute = function () {
        this.commandList = [];

        var selected = this.options.analyticsModel.getFnUnitById(this.options.selectedId);

        // shift right
        var shiftCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand(this.event.source, {
            fid: selected.fid
        });
        this.add(shiftCommand);

        // rollback selected
        var moveCommand = new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitPositionCommand(this.event.source, {
            fid: selected.fid,
            position: {
                x: selected.display.diagram.position.x,
                y: selected.display.diagram.position.y
            }
        });
        this.add(moveCommand);

        // create a new function
        this.options.fnUnit.display.diagram.position.x = selected.display.diagram.position.x + 150;
        this.options.fnUnit.display.diagram.position.y = selected.display.diagram.position.y;
        var newCommand = new Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand(this.event.source, {
            fnUnit: this.options.fnUnit
        });
        this.add(newCommand);

        // reconnect
        var connectCommand;
        for (var i in this.options.analyticsModel.links) {
            var link = this.options.analyticsModel.links[i];
            if (link[SOURCE_FID] == this.options.selectedId) {
                connectCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this.event.source, {
                    kid: link.kid,
                    'sourceFid': this.options.fnUnit.fid,
                    'targetFid': link[TARGET_FID]
                });
                this.add(connectCommand);
            }
        }

        // connect
        connectCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand(this.event.source, {
            kid: Brightics.VA.Core.Utils.IDGenerator.func.id(),
            'sourceFid': this.options.selectedId,
            'targetFid': this.options.fnUnit.fid
        });
        this.add(connectCommand);

        Brightics.VA.Core.CompoundCommand.prototype.execute.call(this);
    };

    AppendNewFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.appendnewfnunitcommand';
    };

    AppendNewFnUnitCommand.prototype.getLabel = function () {
        return 'Append a new Function';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.AppendNewFnUnitCommand = AppendNewFnUnitCommand;

}).call(this);