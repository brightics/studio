/**
 * Created by sds on 2018-02-06.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;
    const CONTROL_KEY = 'seed';

    function SeedControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SeedControl.prototype = Object.create(_super);
    SeedControl.prototype.constructor = SeedControl;

    SeedControl.Label = 'Seed';
    SeedControl.Section = 'left';

    SeedControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    SeedControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>');
        propPanel.addPropertyControl(SeedControl.Label, function ($container) {
            $container.append($elements);
            var jqxOptions = {
                placeholder: 'Random',
                numberType: 'int'
            };
            _this.controls[CONTROL_KEY] = propPanel.createNumberInput($elements, jqxOptions);
        }, {
            propertyControlParent: _this.getSection(SeedControl.Section),
            mandatory: _this.options.isMandatory
        });

        this.bindValidation({
            $target: $elements,
            control: this.controls[CONTROL_KEY],
            label: SeedControl.Label
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SeedControl;

}).call(this);