/**
 * Created by sds on 2018-02-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'gradient';

    function GradientControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    GradientControl.prototype = Object.create(_super);
    GradientControl.prototype.constructor = GradientControl;

    GradientControl.Label = 'Gradient';
    GradientControl.Section = 'right';

    GradientControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Default = 'no_gradient';
        this.Source = [
            {
                "label": "No Gradient",
                "value": "no_gradient"
            },
            {
                "label": "Numerical Gradient",
                "value": "numerical_gradient"
            }
        ];

        this.controls[CONTROL_KEY] = [];
    };

    GradientControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;
        var controlVal = (typeof this.options.value != 'undefined') ? this.options.value : this.Default;

        propPanel.addPropertyControl(GradientControl.Label, function ($container) {
            _this.createRadioButtonControl($container, {
                disabled: _this.options.disabled,
                source: _this.options.source || _this.Source,
                value: controlVal
            });
        }, {
            propertyControlParent: _this.getSection(GradientControl.Section),
            mandatory: _this.options.isMandatory
        });
    };


    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = GradientControl;

}).call(this);
