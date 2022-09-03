/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'num-delta';

    function NumDeltaControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    NumDeltaControl.prototype = Object.create(_super);
    NumDeltaControl.prototype.constructor = NumDeltaControl;

    NumDeltaControl.Label = 'Num Delta';
    NumDeltaControl.Section = 'left';

    NumDeltaControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    NumDeltaControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(NumDeltaControl.Label, function ($container) {
            _this.createNumberArrayControl($container, {
                value: _this.options.value
            });
        }, {
            propertyControlParent: _this.getSection(NumDeltaControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = NumDeltaControl;

}).call(this);
