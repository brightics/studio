/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'vector-type';

    function VectorTypeContol(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    VectorTypeContol.prototype = Object.create(_super);
    VectorTypeContol.prototype.constructor = VectorTypeContol;

    VectorTypeContol.Label = 'Vector Type';
    VectorTypeContol.Section = 'left';

    VectorTypeContol.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Final Val",
                "value": "final_val"
            },
            {
                "label": "Step Size",
                "value": "step_size"
            }
        ];

        this.controls[CONTROL_KEY] = {}
    };

    VectorTypeContol.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(VectorTypeContol.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(VectorTypeContol.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = VectorTypeContol;

}).call(this);