/**
 * Created by sds on 2018-02-26.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'distribution';

    function DistributionControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    DistributionControl.prototype = Object.create(_super);
    DistributionControl.prototype.constructor = DistributionControl;

    DistributionControl.Label = 'Distribution';
    DistributionControl.Section = 'left';

    DistributionControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Cumulative",
                "value": "cumulative"
            },
            {
                "label": "Complementary",
                "value": "complementary"
            }
        ];

    };

    DistributionControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(DistributionControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(DistributionControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = DistributionControl;

}).call(this);