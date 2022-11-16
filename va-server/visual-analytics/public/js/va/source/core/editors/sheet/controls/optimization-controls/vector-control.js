/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'vector';

    function VectorControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    VectorControl.prototype = Object.create(_super);
    VectorControl.prototype.constructor = VectorControl;

    VectorControl.Label = 'Vector';
    VectorControl.Section = 'left';

    VectorControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    VectorControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(VectorControl.Label, function ($container) {
            _this.createNumberArrayControl($container, {
                value: _this.options.value
            });
        }, {
            propertyControlParent: _this.getSection(VectorControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = VectorControl;

}).call(this);
