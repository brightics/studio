/**
 * Created by sungjin1.kim on 2016-04-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var ARRAY_TYPE = ['array[string]', 'array[number]'];
    var NUMBER_TYPE = ['number', 'array[number]'];

    /**
     * options : {
     *      fnUnit : {}
     * }
     *
     * @param options
     * @constructor
     */
    function UpdateVariableDefCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    UpdateVariableDefCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateVariableDefCommand.prototype.constructor = UpdateVariableDefCommand;

    UpdateVariableDefCommand.prototype.canUndo = function () {
        return true;
    };

    UpdateVariableDefCommand.prototype.canRedo = function () {
        return true;
    };

    UpdateVariableDefCommand.prototype.execute = function () {
        var analyticsModel = this.getMainModel();
        this.options.old = _.cloneDeep(analyticsModel.variables[this.options.name]);
        if (this.options.name === this.options.newName) {
            if (this.options.old.type !== this.options.ref.type) {
                var val = this.getValueByType(
                    this.options.old.type,
                    this.options.ref.type,
                    this.options.ref.value);
                    // this.options.old.value);

                val = this.typeCast(val, this.options.ref.type);
                
                // if (this.isArrayType(this.options.old['variable-type'])) {
                //     this.options.ref.value = '';
                // } else {
                //     this.options.ref.value =
                //         this.getValueByType(this.options.old.type, this.options.old.value[0]);
                // }
                // if (this.options.old['variable-type'] === 'array') {
                //     if (this.options.ref['variable-type'] === 'number') {
                //         this.options.ref.value = "";
                //     } else {
                //         this.options.ref.value = String(this.options.old.value[0]);
                //     }
                // } else if (this.options.ref['variable-type'] === 'number') {
                //     this.options.ref.value = "";
                // } else if (this.options.ref['variable-type'] === 'array') {
                //     this.options.ref.value = [this.options.old.value];
                // }
                this.options.ref.value = val;
            }
            analyticsModel.setVariableDef(this.options.name, this.options.ref);
        } else {
            analyticsModel.removeVariableDef(this.options.name);
            analyticsModel.addVariableDef(this.options.newName, this.options.old);
        }
    };

    UpdateVariableDefCommand.prototype.undo = function () {
        var analyticsModel = this.getMainModel();
        if (this.options.name === this.options.newName) {
            analyticsModel.setVariableDef(this.options.name, this.options.old);
        } else {
            analyticsModel.addVariableDef(this.options.name, this.options.old);
            analyticsModel.removeVariableDef(this.options.newName);
        }
    };

    UpdateVariableDefCommand.prototype.redo = function () {
        this.execute();
    };

    UpdateVariableDefCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.updatevariabledefcommand';
    };

    UpdateVariableDefCommand.prototype.getLabel = function () {
        return 'Update Variable';
    };

    UpdateVariableDefCommand.prototype.isArrayType = function (type) {
        return ARRAY_TYPE.indexOf(type) > -1;
    };

    UpdateVariableDefCommand.prototype.isNumeric = function (type) {
        return NUMBER_TYPE.indexOf(type) > -1;
    };

    UpdateVariableDefCommand.prototype.getValueByType = function (curType, nxtType, val) {
        if (this.isArrayType(curType) && !this.isArrayType(nxtType)) {
            return val[0];
        } else if (!this.isArrayType(curType) && this.isArrayType(nxtType)) {
            return [val];
        }
        return val;
    };

    UpdateVariableDefCommand.prototype.typeCast = function (val, type) {
        var ret = val;
        if (this.isNumeric(type)) {
            if (this.isArrayType(type)) ret = _.map(ret, this.toNumber.bind(this));
            else ret = this.toNumber(ret);
        } else {
            if (this.isArrayType(type)) ret = _.map(ret, this.toString.bind(this));
            else ret = this.toString(ret);
        }
        return ret;
    };

    // UpdateVariableDefCommand.prototype.toString = function (val) {
    //     if (_.isNumber(val)) {
    //         if (_.isNaN(val)) return '';
    //         return val.toString();
    //     }
    //     return val;
    // };

    UpdateVariableDefCommand.prototype.toString = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return '';
        if (_.isNumber(val)) {
            if (_.isNaN(val)) return '';
            return val.toString();
        }
        return val;
    };

    UpdateVariableDefCommand.prototype.toNumber = function (val) {
        if (_.isNull(val) || _.isUndefined(val) || val === '') return 0;
        return Number(this.toString(Number(val)));
    };
    
    Brightics.VA.Core.Editors.Diagram.Commands.UpdateVariableDefCommand = UpdateVariableDefCommand;

}).call(this);