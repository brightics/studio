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
    function PrependNewFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.CompoundCommand.call(this, eventSource, options);
    }

    PrependNewFnUnitCommand.prototype = Object.create(Brightics.VA.Core.CompoundCommand.prototype);
    PrependNewFnUnitCommand.prototype.constructor = PrependNewFnUnitCommand;

    PrependNewFnUnitCommand.prototype.execute = function () {
        this.commandList = [];

        var selected = this.options.analyticsModel.getFnUnitById(this.options.selectedId);

        // shift right
        var shiftCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ShiftRightCommand(this.event.source, {
            fid: selected.fid
        });
        this.add(shiftCommand);

        // create a new function
        this.options.fnUnit.display.diagram.position.x = selected.display.diagram.position.x;
        this.options.fnUnit.display.diagram.position.y = selected.display.diagram.position.y;
        var newCommand = new Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand(this.event.source, {
            fnUnit: this.options.fnUnit
        });
        this.add(newCommand);

        // reconnect
        var connectCommand;
        for (var i in this.options.analyticsModel.links) {
            var link = this.options.analyticsModel.links[i];
            if (link[TARGET_FID] == this.options.selectedId) {
                connectCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this.event.source, {
                    kid: link.kid,
                    'sourceFid': link[SOURCE_FID],
                    'targetFid': this.options.fnUnit.fid
                });
                this.add(connectCommand);
                break;
            }
        }

        // connect
        connectCommand = new Brightics.VA.Core.Editors.Diagram.Commands.ConnectFnUnitCommand(this.event.source, {
            kid: Brightics.VA.Core.Utils.IDGenerator.link.id(),
            'sourceFid': this.options.fnUnit.fid,
            'targetFid': this.options.selectedId
        });
        this.add(connectCommand);

        Brightics.VA.Core.CompoundCommand.prototype.execute.call(this);
    };

    PrependNewFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.prependnewfnunitcommand';
    };

    PrependNewFnUnitCommand.prototype.getLabel = function () {
        return 'Append a new Function';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.PrependNewFnUnitCommand = PrependNewFnUnitCommand;

}).call(this);