/**
 * Created by jmk09.jung on 2016-02-03.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function PanelFactory() {
    }

    PanelFactory.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.PanelFactory.prototype);
    PanelFactory.prototype.constructor = PanelFactory;

    PanelFactory.prototype.createInDataPanel = function ($parent, options) {
        if (options.fnUnit[IN_DATA]) {
            options.title = options.title || 'In';
            options.resizable = options.fnUnit[OUT_DATA] ? true : false;

            var func = options.fnUnit.func;
            var DataPanel = Brightics.VA.Core.Editors.Sheet.Panels.DataPanel;
            
            // in과 out 구분을 DataPanel 내부에서 하고 있어서, export는 in panel만 있는 상태에서 if로 구분하였음.. 
            // TODO: InDataPanel, OutDataPanel 클래스를 따로 구현해야 할듯.
            if (func === 'export') {
                DataPanel = Brightics.VA.Implementation.DataFlow.Functions[func].DataPanel;
            }
            return new DataPanel($parent, options);
        }
    };

    PanelFactory.prototype.createOutDataPanel = function ($parent, options) {
        if (options.fnUnit[OUT_DATA]) {
            options.title = options.title || 'Out';
            options.resizable = options.fnUnit[IN_DATA] ? true : false;
            var func = options.fnUnit.func;
            var DataPanel = Brightics.VA.Implementation.DataFlow.Functions[func].DataPanel || Brightics.VA.Core.Editors.Sheet.Panels.DataPanel;    

            if (func === 'eDA') {
                DataPanel = Brightics.VA.Implementation.DataFlow.Functions[func].DataPanel;
            }
            
            return new DataPanel($parent, options);
        }
    };

    Brightics.VA.Implementation.DataFlow.Editors.Sheet.PanelFactory = PanelFactory;

}).call(this);