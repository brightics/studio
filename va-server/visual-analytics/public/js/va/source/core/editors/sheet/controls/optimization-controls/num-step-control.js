/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'num-step';

    function NumStepControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    NumStepControl.prototype = Object.create(_super);
    NumStepControl.prototype.constructor = NumStepControl;

    NumStepControl.Label = 'Num Step';
    NumStepControl.Section = 'left';

    NumStepControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    NumStepControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(NumStepControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                min: 1,
                max: 1000,
                placeholder: 100,
                numberType: 'int'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(NumStepControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: NumStepControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = NumStepControl;

}).call(this);