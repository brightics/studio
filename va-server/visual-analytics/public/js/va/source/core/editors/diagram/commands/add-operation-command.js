/* -----------------------------------------------------
 *  add-operation-command.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-27.
 * ---------------------------------------------------- */

(function () {
    'use strict';
    var root = this;
    var Brightics = root.Brightics;
    var ObjectUtils = root.__module__.ObjectUtils;

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function AddOperationCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AddOperationCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AddOperationCommand.prototype.constructor = AddOperationCommand;

    AddOperationCommand.prototype.canUndo = function () {
        return true;
    };

    AddOperationCommand.prototype.canRedo = function () {
        return true;
    };

    AddOperationCommand.prototype.execute = function () {
        this.setValue(this.options.path, this.options.value);
    };

    AddOperationCommand.prototype.undo = function () {
        this.removeValue(this.options.path);
    };

    AddOperationCommand.prototype.redo = function () {
        this.execute();
    };

    AddOperationCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.addoperationcommand';
    };

    AddOperationCommand.prototype.getLabel = function () {
        return this.options.label;
    };

    // AddOperationCommand.prototype.copy = function (newValue) {
    //     return _.clone(newValue);
    //     // if (newValue instanceof Array) return $.extend(true, [], newValue);
    //     // else if (newValue instanceof Object) return $.extend(true, {}, newValue);
    //     // return newValue;
    // };

    AddOperationCommand.prototype.setValue = function (path, newValue) {
        var fn = this.options.fnUnit || this.options.target;
        ObjectUtils.addProp(fn, path, newValue);
        // var idx = -1;
        // var len = path.length;
        // while (++idx < len - 1) {
        //     fn = fn[path[idx]];
        // }
        // fn[path[path.length - 1]] = this.copy(newValue);
    };

    AddOperationCommand.prototype.removeValue = function (path) {
        var fn = this.options.fnUnit || this.options.target;
        ObjectUtils.removeProp(fn, path);
        // var idx = -1;
        // var len = path.length;
        // while (++idx < len - 1) {
        //     fn = fn[path[idx]];
        // }
        // if (fn instanceof Array) {
        //     fn.splice(path[path.length - 1], 1);
        // } else {
        //     delete fn[path[path.length - 1]];
        // }
    };

    Brightics.VA.Core.Editors.Diagram.Commands.AddOperationCommand = AddOperationCommand;
/* eslint-disable no-invalid-this */
}.call(this));

