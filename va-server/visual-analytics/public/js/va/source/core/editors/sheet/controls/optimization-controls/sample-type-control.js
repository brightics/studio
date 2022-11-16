/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'sample-type';

    function SampleTypeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SampleTypeControl.prototype = Object.create(_super);
    SampleTypeControl.prototype.constructor = SampleTypeControl;

    SampleTypeControl.Label = 'Sample Type';
    SampleTypeControl.Section = 'left';

    SampleTypeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Latin Hypercube Sampling",
                "value": "latin_hypercube_sampling"
            },
            {
                "label": "Random",
                "value": "random"
            }
        ];

        this.controls[CONTROL_KEY] = {}
    };

    SampleTypeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(SampleTypeControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(SampleTypeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SampleTypeControl;

}).call(this);