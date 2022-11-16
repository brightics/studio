/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpdateUnitCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);

        this.old.display = {};
        this.old.param = {};
    }

    UpdateUnitCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateUnitCommand.prototype.constructor = UpdateUnitCommand;

    UpdateUnitCommand.prototype.execute = function () {
        for (let key in this.options.display) {
            this.old.display[key] = this.options.unit.display[key];
            this.options.unit.display[key] = this.options.display[key];
        }
        for (let key in this.options.param) {
            this.old.param[key] = Array.isArray(this.options.unit.param[key]) ? $.extend([], this.options.unit.param[key]) : this.options.unit.param[key];
            this.options.unit.param[key] = this.options.param[key];
        }
    };

    UpdateUnitCommand.prototype.undo = function () {
        for (let key in this.old.display) {
            this.options.unit.display[key] = this.old.display[key];
        }
        for (let key in this.old.param) {
            this.options.unit.param[key] = Array.isArray(this.old.param[key]) ? $.extend([], this.old.param[key]) : this.old.param[key];
        }
    };

    UpdateUnitCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.controleditor.updateunitcommand';
    };

    UpdateUnitCommand.prototype.getLabel = function () {
        return 'Update Unit';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.ControlEditor.UpdateUnitCommand = UpdateUnitCommand;

}).call(this);