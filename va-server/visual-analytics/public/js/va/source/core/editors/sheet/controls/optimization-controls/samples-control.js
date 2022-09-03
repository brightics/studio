/**
 * Created by sds on 2018-02-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;
    const CONTROL_KEY = 'samples';

    function SamplesControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SamplesControl.prototype = Object.create(_super);
    SamplesControl.prototype.constructor = SamplesControl;

    SamplesControl.Label = 'Samples';
    SamplesControl.Section = 'left';

    SamplesControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    SamplesControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(SamplesControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                placeholder: '0',
                numberType: 'int'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(SamplesControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: SamplesControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SamplesControl;

}).call(this);