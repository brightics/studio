/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetContentsPanelCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
    }

    SetContentsPanelCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetContentsPanelCommand.prototype.constructor = SetContentsPanelCommand;

    /**
     * $.extend 로는 array 가 deep copy 되지 않아서, 별도로 구현 by daewon.park
     * @param targetObject
     * @param sourceObject
     * @private
     */
    SetContentsPanelCommand.prototype._assignArray = function (targetObject, sourceObject) {
        for (var key in sourceObject) {
            if ($.isPlainObject(sourceObject[key])) {
                this._assignArray(targetObject[key], sourceObject[key]);
            } else if ($.isArray(sourceObject[key])) {
                targetObject[key] = $.extend(true, [], sourceObject[key]);
            }
        }
    };

    SetContentsPanelCommand.prototype.execute = function () {
        this.old.chartOption = {};
        for (var key in this.options.ref.chartOption) {
            // backup
            if (this.options.panelOption.chartOption[key]) {
                this.old.chartOption[key] = JSON.parse(JSON.stringify(this.options.panelOption.chartOption[key]));
            } else {
                this.old.chartOption[key] = null;
            }
            // change
            this.options.panelOption.chartOption[key] = JSON.parse(JSON.stringify(this.options.ref.chartOption[key]));
        };
    };

    SetContentsPanelCommand.prototype.undo = function () {
        for (var key in this.old.chartOption) {
            if (this.old.chartOption[key]) {
                this.options.panelOption.chartOption[key] = JSON.parse(JSON.stringify(this.old.chartOption[key]));
            } else {
                this.options.panelOption.chartOption[key] = null;
            }
        }
    };

    SetContentsPanelCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setcontentspanelcommand';
    };

    SetContentsPanelCommand.prototype.getLabel = function () {
        return 'Change Chart Options';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetContentsPanelCommand = SetContentsPanelCommand;

}).call(this);