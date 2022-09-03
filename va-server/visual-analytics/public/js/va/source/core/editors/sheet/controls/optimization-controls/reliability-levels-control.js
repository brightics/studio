/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'reliability-levels';

    function ReliabilityLevelsControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ReliabilityLevelsControl.prototype = Object.create(_super);
    ReliabilityLevelsControl.prototype.constructor = ReliabilityLevelsControl;

    ReliabilityLevelsControl.Label = 'Reliability Levels';
    ReliabilityLevelsControl.Section = 'left';

    ReliabilityLevelsControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ReliabilityLevelsControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(ReliabilityLevelsControl.Label, function ($container) {
            _this.createInputControl($container, {
                maxLength: 1000,
                placeHolder: "ex) '[[0.1,0.2], [0.3,0.4]]"
            });
        }, {
            propertyControlParent: _this.getSection(ReliabilityLevelsControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ReliabilityLevelsControl;

}).call(this);