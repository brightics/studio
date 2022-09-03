(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    var OUT_DATA = 'outData';
    /**
    * options : {
    * fnUnit : {}
    * }
    *
    * @param options
    * @constructor
    */
    function ReturnDataCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }
    ReturnDataCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    ReturnDataCommand.prototype.constructor = ReturnDataCommand;
    ReturnDataCommand.prototype.canUndo = function () {
        return true;
    };
    ReturnDataCommand.prototype.canRedo = function () {
        return true;
    };
    ReturnDataCommand.prototype.execute = function () {
        var activeModel = this.getActiveModel();
        this.old = activeModel[OUT_DATA];
        activeModel[OUT_DATA] = this.options[OUT_DATA];
    };
    ReturnDataCommand.prototype.undo = function () {
        var activeModel = this.getActiveModel();
        activeModel[OUT_DATA] = this.old;
    };
    ReturnDataCommand.prototype.redo = function () {
        this.execute();
    };
    ReturnDataCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.returndatacommand';
    };
    ReturnDataCommand.prototype.getLabel = function () {
        return 'Change Return Data';
    };
    Brightics.VA.Core.Editors.Diagram.Commands.ReturnDataCommand = ReturnDataCommand;
}).call(this);