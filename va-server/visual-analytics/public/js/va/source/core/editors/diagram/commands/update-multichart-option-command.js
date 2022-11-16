/* -----------------------------------------------------
 *  update-multichart-option-command.js
 *  Created by hyunseok.oh@samsung.com on 2018-08-10.
 * ---------------------------------------------------- */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpdateMultiChartOptionCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.old = {};
    }

    UpdateMultiChartOptionCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    UpdateMultiChartOptionCommand.prototype.constructor = UpdateMultiChartOptionCommand;

    UpdateMultiChartOptionCommand.prototype.canUndo = function () {
        return true;
    };

    UpdateMultiChartOptionCommand.prototype.canRedo = function () {
        return true;
    };

    UpdateMultiChartOptionCommand.prototype.execute = function () {
        var self = this;
        var getChartOptionPath = function (opt, model, _cb) {
            var cb = _.once(_cb);
            var path = ['functions'];
            _.forEach(model.functions, function (fn, idx) {
                if (fn.fid === opt.fid) {
                    path = path.concat([idx, 'display', 'sheet']);
                    _.forIn(_.get(fn, 'display.sheet'), function (inOut, inOutKey) {
                        _.forIn(inOut, function (sheet, modeKey) {
                            var chartPanelIndex = _.findIndex(sheet[0].panel, function (modePanel) {
                                return modePanel.id === opt.cid;
                            });
                            if (typeof sheet[0].panel[chartPanelIndex] !== 'undefined') {
                                path = path.concat([
                                    inOutKey,
                                    modeKey,
                                    0,
                                    'panel',
                                    chartPanelIndex,
                                    'multiChartOption']);
                                return cb(path);
                            }
                        });
                    });
                }
            });
        };

        getChartOptionPath(self.options, self.getTargetModel(), function (path) {
            self.path = path;
            self.old = _.cloneDeep(_.get(self.getTargetModel(), path));
            _.set(self.getTargetModel(), path, self.options.value);
        });
    };

    UpdateMultiChartOptionCommand.prototype.undo = function () {
        _.set(self.getTargetModel(), self.path, self.old);
    };

    UpdateMultiChartOptionCommand.prototype.redo = function () {
        this.execute();
    };

    UpdateMultiChartOptionCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.updatemultichartoptioncommand';
    };

    UpdateMultiChartOptionCommand.prototype.getLabel = function () {
        return 'Update Multi Chart Option';
    };

    Brightics.VA.Core.Editors.Diagram.Commands.UpdateMultiChartOptionCommand =
        UpdateMultiChartOptionCommand;
/* eslint-disable no-invalid-this */
}.call(this));
