/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'convergence-tolerance';

    function ConvergenceToleranceControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ConvergenceToleranceControl.prototype = Object.create(_super);
    ConvergenceToleranceControl.prototype.constructor = ConvergenceToleranceControl;

    ConvergenceToleranceControl.Label = 'Convergence Tolerance';
    ConvergenceToleranceControl.Section = 'left';

    ConvergenceToleranceControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ConvergenceToleranceControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(ConvergenceToleranceControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                placeholder: '1.e-4',
                numberType: 'double'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(ConvergenceToleranceControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: ConvergenceToleranceControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ConvergenceToleranceControl;

}).call(this);