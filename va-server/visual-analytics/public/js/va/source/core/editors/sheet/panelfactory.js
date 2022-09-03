/**
 * Created by jmk09.jung on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var FnUnitUtils = brtc_require('FnUnitUtils');

    function PanelFactory() {
    }

    PanelFactory.prototype.createInDataPanel = function ($parent, options) {
        if (options.fnUnit[IN_DATA]) {
            options.title = options.title || 'In';
            options.resizable = options.fnUnit[OUT_DATA] ? true : false;
            return new Brightics.VA.Core.Editors.Sheet.Panels.DataPanel($parent, options);
        }
    };

    PanelFactory.prototype.createOutDataPanel = function ($parent, options) {
        if (options.fnUnit[OUT_DATA]) {
            options.title = options.title || 'Out';
            options.resizable = options.fnUnit[IN_DATA] ? true : false;
            return new Brightics.VA.Core.Editors.Sheet.Panels.DataPanel($parent, options);
        }
    };

    PanelFactory.prototype.createPropertiesPanel = function ($parent, options) {
        if (options.fnUnit && options.fnUnit.func) {
            var implementationClazz = options.fnUnit.parent().type;
            options.title = options.title || options.fnUnit.display.label;
            var clazz = typeof Brightics.VA.Core.Interface.Functions[implementationClazz][options.fnUnit.func] === 'undefined' ? Brightics.VA.Core.Interface.Functions[implementationClazz].unknownFunction.propertiesPanel : Brightics.VA.Core.Interface.Functions[implementationClazz][options.fnUnit.func].propertiesPanel;
            return new clazz($parent, options);
        }
    };

    PanelFactory.prototype.create = function ($parent, options) {
        var panelType = options.type;
        var panel;

        if (!this[panelType]) {
            panel = this.note();
        } else {
            if (options.panelType === 'in') options.resizable = FnUnitUtils.hasOutput(options.fnUnit) ? true : false;
            if (options.panelType === 'out') options.resizable = FnUnitUtils.hasInput(options.fnUnit) ? true : false;

            panel = this[panelType]($parent, options);
        }
        return panel;
    };
    PanelFactory.prototype.inData = function ($parent, options) {
        if (options.fnUnit[IN_DATA]) {
            options.title = options.title || 'In';
            options.resizable = options.fnUnit[OUT_DATA] ? true : false;
            return new Brightics.VA.Core.Editors.Sheet.Panels.DataPanel($parent, options);
        }
    };
    PanelFactory.prototype.outData = function ($parent, options) {
        if (options.fnUnit[OUT_DATA]) {
            options.title = options.title || 'Out';
            options.resizable = options.fnUnit[IN_DATA] ? true : false;
            return new Brightics.VA.Core.Editors.Sheet.Panels.DataPanel($parent, options);
        }
    };
    PanelFactory.prototype.table = function ($parent, options) {
        options.title = options.title || (options.panelType === 'in') ? 'In' : 'Out';
        var DataPanel = FnUnitUtils.getDataPanel(options.fnUnit, options.panelType);

        return new DataPanel($parent, options);
    };
    PanelFactory.prototype.model = function ($parent, options) {
        options.title = options.title || (options.panelType === 'in') ? 'In' : 'Out';
        return new Brightics.VA.Core.Editors.Sheet.Panels.ModelPanel($parent, options);
    };
    PanelFactory.prototype.html = function ($parent, options) {
        return new Brightics.VA.Core.Editors.Sheet.Panels.HtmlPanel($parent, options);
    };
    PanelFactory.prototype.md = function ($parent, options) {
    };
    PanelFactory.prototype.image = function ($parent, options) {
        options.title = options.title || (options.panelType === 'in') ? 'In' : 'Out';
        return new Brightics.VA.Core.Editors.Sheet.Panels.ImagePanel($parent, options);
    };
    PanelFactory.prototype.note = function ($parent, options) {
    };

    Brightics.VA.Core.Editors.Sheet.PanelFactory = PanelFactory;
}).call(this);
