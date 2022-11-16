/**
 * Created by sds on 2018-02-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'max-iterations';

    function MaxIterationControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    MaxIterationControl.prototype = Object.create(_super);
    MaxIterationControl.prototype.constructor = MaxIterationControl;

    MaxIterationControl.Label = 'Max Iterations';
    MaxIterationControl.Section = 'left';

    MaxIterationControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    MaxIterationControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(MaxIterationControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                placeholder: 100,
                numberType: 'int'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(MaxIterationControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: MaxIterationControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = MaxIterationControl;

}).call(this);