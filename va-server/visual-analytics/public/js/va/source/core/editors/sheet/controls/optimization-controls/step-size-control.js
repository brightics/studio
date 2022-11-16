/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'step-size';

    function StepSizeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    StepSizeControl.prototype = Object.create(_super);
    StepSizeControl.prototype.constructor = StepSizeControl;

    StepSizeControl.Label = 'Step Size';
    StepSizeControl.Section = 'left';

    StepSizeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    StepSizeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(StepSizeControl.Label, function ($container) {
            _this.createNumberArrayControl($container);
        }, {
            propertyControlParent: _this.getSection(StepSizeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = StepSizeControl;

}).call(this);
