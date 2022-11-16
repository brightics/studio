/**
 * Created by sds on 2018-02-26.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'gen-reliability-levels';

    function GenReliabilityLevelsControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    GenReliabilityLevelsControl.prototype = Object.create(_super);
    GenReliabilityLevelsControl.prototype.constructor = GenReliabilityLevelsControl;

    GenReliabilityLevelsControl.Label = 'Gen Reliability Levels';
    GenReliabilityLevelsControl.Section = 'left';

    GenReliabilityLevelsControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    GenReliabilityLevelsControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(GenReliabilityLevelsControl.Label, function ($container) {
            _this.createInputControl($container, {
                maxLength: 1000,
                placeHolder: "ex) '[[0.1,0.2], [0.3,0.4]]"
            });
        }, {
            propertyControlParent: _this.getSection(GenReliabilityLevelsControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = GenReliabilityLevelsControl;

}).call(this);