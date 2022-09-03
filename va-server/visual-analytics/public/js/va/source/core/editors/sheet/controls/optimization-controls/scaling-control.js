/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'scaling',
        OBJECTIVES_CONTROL_KEY = 'objectives',
        CONSTRAINTS_CONTROL_KEY = 'constraints';

    function ScalingControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ScalingControl.prototype = Object.create(_super);
    ScalingControl.prototype.constructor = ScalingControl;

    ScalingControl.Label = 'Scaling';
    ScalingControl.Section = 'left';

    ScalingControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Default = 'false';
        this.Source = [
            {
                "label": "True",
                "value": "true"
            },
            {
                "label": "False",
                "value": "false"
            }
        ];

        this.controls[CONTROL_KEY] = [];
    };

    ScalingControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;
        var controlVal = (typeof this.options.value != 'undefined') ? this.options.value : this.Default;

        propPanel.addPropertyControl(ScalingControl.Label, function ($container) {
            _this.createRadioButtonControl($container, {
                source: _this.options.source || _this.Source,
                value: controlVal
            });
        }, {
            propertyControlParent: _this.getSection(ScalingControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    ScalingControl.prototype.configureControls = function ($deckControl, paramName, selectedVal) {
        this.caller.controls[OBJECTIVES_CONTROL_KEY].configureScalingControls();
        this.caller.controls[CONSTRAINTS_CONTROL_KEY].configureScalingControls();
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ScalingControl;

}).call(this);
