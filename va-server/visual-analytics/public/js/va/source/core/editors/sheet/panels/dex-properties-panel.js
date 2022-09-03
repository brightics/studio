/**
 * Source:
 * Created by daewon.park on 2017-06-15.
 */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DexPropertiesPanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
    }

    DexPropertiesPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    DexPropertiesPanel.prototype.constructor = DexPropertiesPanel;

    DexPropertiesPanel.prototype.createPersistButton = function () {
        var $persistButton = this.$mainControl.find('.brtc-va-editors-sheet-panels-propertiespanel-header > .brtc-va-editors-sheet-panels-basepanel-header-title');
        $persistButton.addClass('no-content');
    };

    DexPropertiesPanel.prototype.renderPersistButton = function () {
        // do nothing
    };

    DexPropertiesPanel.prototype.renderValues = function (command) {
        var _this = this;
        for (var j in command ? command.options.ref['dex-param'] : this.render) {
            this.render[j].bind(_this)();
        }
    };

    DexPropertiesPanel.prototype.createSetParameterValueCommand = function (paramName, paramValue) {
        var commandOption = {
            fnUnit: this.options.fnUnit,
            ref: {
                'dex-param': {}
            }
        };

        commandOption.ref['dex-param'][paramName] = paramValue;

        return new Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitDexParameterValueCommand(this, commandOption);
    };

    DexPropertiesPanel.prototype.handleCommand = function (command) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.handleCommand.call(this, command);

        if (command instanceof Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitDexParameterValueCommand) this.handleSetFnUnitParameterValueCommand(command);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.DexPropertiesPanel = DexPropertiesPanel;

}).call(this);    