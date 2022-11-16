/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NewUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    NewUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    NewUnitCommand.prototype.constructor = NewUnitCommand;

    NewUnitCommand.prototype.execute = function () {
        var functions = this.options.parent.param ? this.options.parent.param.functions : this.options.parent.functions;
        this.options.unit = this.options.analyticsModel.newFnUnit(this.options.func);
        // this.options.fid = this.options.unit.fid;

        if (this.options.dataFlowFile) {
            this.createDataFlowUnitInformation();
        }

        if (this.options.index !== -1) {
            functions.splice(this.options.index, 0, this.options.unit);
        } else {
            functions.push(this.options.unit);
            this.options.index = functions.indexOf(this.options.unit);
        }
    };

    NewUnitCommand.prototype.redo = function () {
        var functions = this.options.parent.param ? this.options.parent.param.functions : this.options.parent.functions;
        // this.options.unit = this.options.analyticsModel.newFnUnit(this.options.func);
        // this.options.unit.fid = this.options.fid;

        if (this.options.dataFlowFile) {
            this.createDataFlowUnitInformation();
        }

        if (this.options.index !== -1) {
            functions.splice(this.options.index, 0, this.options.unit);
        } else {
            functions.push(this.options.unit);
            this.options.index = functions.indexOf(this.options.unit);
        }
    };

    NewUnitCommand.prototype.undo = function () {
        var functions = this.options.parent.param ? this.options.parent.param.functions : this.options.parent.functions;
        functions.splice(this.options.index, 1);
    };

    NewUnitCommand.prototype.createDataFlowUnitInformation = function () {
        var unit = this.options.unit;
        var file = this.options.dataFlowFile;
        var gvMap = file.getContents()['gv-def'] || {};

        unit.param.mid = file.getFileId();
        unit.param.label = file.getLabel() || '';
        unit.param.description = file.getDescription() || '';

        unit.display = {
            label: file.getLabel(),
            description: ''
        };

        $.map(gvMap, function (gv, key) {
            unit.param.args[key] = {
                'type': 'literal',
                'value': gv.value,
                'variable-type': gv['variable-type'] || 'string'
            };
        });
    };

    NewUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.newunitcommand';
    };

    NewUnitCommand.prototype.getLabel = function () {
        return 'New Unit';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.NewUnitCommand = NewUnitCommand;
}).call(this);
