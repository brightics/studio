/**
 * Created by daewon77.park on 2016-03-27.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var FnUnitUtils = brtc_require('FnUnitUtils');

    /**
     * options : {
     *      fid : ''
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function SwitchFnUnitCommand(eventSource, options) {
        Brightics.VA.Core.CompoundCommand.call(this, eventSource, options);
    }

    SwitchFnUnitCommand.prototype = Object.create(Brightics.VA.Core.CompoundCommand.prototype);
    SwitchFnUnitCommand.prototype.constructor = SwitchFnUnitCommand;

    SwitchFnUnitCommand.prototype.execute = function () {
        var _this = this;
        this.commandList = [];

        this.add(new Brightics.VA.Core.Editors.Diagram.Commands.NewFnUnitCommand(this.event.source, {
            fnUnit: this.options.fnUnit
        }));

        var newActivityOptions = Brightics.VA.Core.Utils.NestedFlowUtils
            .getNewActivityCommandOptions(this.options.fnUnit);

        if (!_.isEmpty(newActivityOptions)) {
            this.add(_.map(newActivityOptions, function (opt) {
                return new Brightics.VA.Core.Editors.Diagram.Commands
                    .NewActivityCommand(_this.event.source, opt);
            }));
        }

        var command;

        for (var i in this.options.analyticsModel.links) {
            var linkUnit = this.options.analyticsModel.links[i];
            if (linkUnit[SOURCE_FID] == this.options.fid) {
                //바뀐 함수가 Out이 없는 경우 링크를 끊는다.
                // if (!funcDefinition['out-range'].min) {
                if (!FnUnitUtils.hasOutput(this.options.fnUnit)) {
                    command = new Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand(this.event.source, {
                        kid: linkUnit.kid,
                        'sourceFid': this.options.fnUnit.fid,
                        'targetFid': linkUnit[TARGET_FID]
                    });
                } else {
                    command = new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this.event.source, {
                        kid: linkUnit.kid,
                        'sourceFid': this.options.fnUnit.fid,
                        'targetFid': linkUnit[TARGET_FID]
                    });
                }
                this.add(command);
            }
            if (linkUnit[TARGET_FID] == this.options.fid) {
                //바뀐 함수가 IN이 없는 경우 링크를 끊는다.
                // if (!funcDefinition['in-range'].min) {
                if (!FnUnitUtils.hasInput(this.options.fnUnit)) {
                    command = new Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand(this.event.source, {
                        kid: linkUnit.kid,
                        'sourceFid': linkUnit[SOURCE_FID],
                        'targetFid': this.options.fnUnit.fid
                    });
                } else {
                    command = new Brightics.VA.Core.Editors.Diagram.Commands.ReconnectFnUnitCommand(this.event.source, {
                        kid: linkUnit.kid,
                        'sourceFid': linkUnit[SOURCE_FID],
                        'targetFid': this.options.fnUnit.fid
                    });
                }
                this.add(command);
            }
        }

        var innerModels = Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(
            this.getTargetModel(), this.options.prvFnUnit);

        if (!_.isEmpty(innerModels)) {
            this.add(_.map(innerModels, function (model) {
                return new Brightics.VA.Core.Editors.Diagram.Commands
                    .RemoveActivityCommand(_this.event.source, {
                        mid: model.mid
                    });
            }));
        }

        this.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitCommand(this.event.source, {
            fid: this.options.fid
        }));

        Brightics.VA.Core.CompoundCommand.prototype.execute.call(this);
    };

    SwitchFnUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.switchfnunitcommand';
    };

    SwitchFnUnitCommand.prototype.getLabel = function () {
        return 'Switch a Function';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SwitchFnUnitCommand = SwitchFnUnitCommand;

}).call(this);
