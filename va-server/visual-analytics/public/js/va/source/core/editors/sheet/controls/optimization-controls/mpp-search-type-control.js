/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'mpp-search';

    function MppSearchTypeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    MppSearchTypeControl.prototype = Object.create(_super);
    MppSearchTypeControl.prototype.constructor = MppSearchTypeControl;

    MppSearchTypeControl.Label = 'Mpp Search';
    MppSearchTypeControl.Section = 'left';

    MppSearchTypeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "None",
                "value": "none"
            },
            {
                "label": "X Taylor Mean",
                "value": "x_taylor_mean"
            },
            {
                "label": "U Taylor Mean",
                "value": "u_taylor_mean"
            },
            {
                "label": "X Taylor Mpp",
                "value": "x_taylor_mpp"
            },
            {
                "label": "U Taylor Mpp",
                "value": "u_taylor_mpp"
            },
            {
                "label": "X Two Point",
                "value": "x_two_point"
            },
            {
                "label": "U Two Point",
                "value": "u_two_point"
            },
            {
                "label": "No Approx",
                "value": "no_approx"
            }
        ];

        this.controls[CONTROL_KEY] = {}
    };

    MppSearchTypeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(MppSearchTypeControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(MppSearchTypeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = MppSearchTypeControl;

}).call(this);