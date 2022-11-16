/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**
     * options : {
     *      kid : '',
     *      source-fid : '',
     *      target-fid : ''
     * }
     * @param options
     * @constructor
     */
    function AddInnerModelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    AddInnerModelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    AddInnerModelCommand.prototype.constructor = AddInnerModelCommand;

    AddInnerModelCommand.prototype.canUndo = function () {
        return true;
    };

    AddInnerModelCommand.prototype.canRedo = function () {
        return true;
    };

    AddInnerModelCommand.prototype.execute = function () {
        this.options.activeModel.links.push(this.linkUnit);

        var sourceFnUnit = this.options.activeModel.getFnUnitById(this.options[SOURCE_FID]);
        var targetFnUnit = this.options.activeModel.getFnUnitById(this.options[TARGET_FID]);

        if (sourceFnUnit[OUT_DATA].length > 0 && targetFnUnit.hasOwnProperty('inData')) {
            var clazz = targetFnUnit.parent().type;
            var inTableMaxLength = Brightics.VA.Core.Interface.Functions[clazz][targetFnUnit.func]['in-range'].max;

            if (targetFnUnit[IN_DATA] && targetFnUnit[IN_DATA].length < inTableMaxLength && this.options.isMaintainIntable !== true) {
                targetFnUnit[IN_DATA].push(sourceFnUnit[OUT_DATA][0]);
            }

            if (targetFnUnit.func === 'unload') {
                targetFnUnit.param['df-names'] = targetFnUnit[IN_DATA];
            }


            if (targetFnUnit[FUNCTION_NAME] === 'Subflow') {
                targetFnUnit.param.functions[0][IN_DATA] = $.extend(true, [], targetFnUnit[IN_DATA]);
                if (targetFnUnit.param.functions[0].func === 'unload') {
                    targetFnUnit.param.functions[0].param['df-names'] = targetFnUnit[IN_DATA];
                }
            }
        }
    };

    AddInnerModelCommand.prototype.undo = function () {
        //TODO
    };

    AddInnerModelCommand.prototype.redo = function () {
        this.execute();
    };

    AddInnerModelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.addInnerModelCommand';
    };

    AddInnerModelCommand.prototype.getLabel = function () {
        return 'Add InnerModel';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.AddInnerModelCommand = AddInnerModelCommand;

}).call(this);