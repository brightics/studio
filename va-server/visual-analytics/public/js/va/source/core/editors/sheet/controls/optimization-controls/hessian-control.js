/**
 * Created by sds on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'hessian';

    function HessianControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    HessianControl.prototype = Object.create(_super);
    HessianControl.prototype.constructor = HessianControl;

    HessianControl.Label = 'Hessian';
    HessianControl.Section = 'right';

    HessianControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Default = 'no_hessian';
        this.Source = [
            {
                "label": "No Hessian",
                "value": "no_hessian"
            },
            {
                "label": "Numerical Hessian",
                "value": "numerical_hessian"
            }
        ];

        this.controls[CONTROL_KEY] = [];
    };

    HessianControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;
        var controlVal = (typeof this.options.value != 'undefined') ? this.options.value : this.Default;

        propPanel.addPropertyControl(HessianControl.Label, function ($container) {
            _this.createRadioButtonControl($container, {
                disabled: _this.options.disabled,
                source: _this.options.source || _this.Source,
                value: controlVal
            });
        }, {
            propertyControlParent: _this.getSection(HessianControl.Section),
            mandatory: _this.options.isMandatory
        });
    };


    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = HessianControl;

}).call(this);
