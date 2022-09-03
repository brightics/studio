/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'max-evaluations';

    function MaxEvaluationControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    MaxEvaluationControl.prototype = Object.create(_super);
    MaxEvaluationControl.prototype.constructor = MaxEvaluationControl;

    MaxEvaluationControl.Label = 'Max Evaluations';
    MaxEvaluationControl.Section = 'left';

    MaxEvaluationControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    MaxEvaluationControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(MaxEvaluationControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                placeholder: 1000,
                numberType: 'int'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(MaxEvaluationControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: MaxEvaluationControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = MaxEvaluationControl;

}).call(this);