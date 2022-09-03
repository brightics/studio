/**
 * Created by sds on 2018-02-21.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'dace-type';

    function DaceTypeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    DaceTypeControl.prototype = Object.create(_super);
    DaceTypeControl.prototype.constructor = DaceTypeControl;

    DaceTypeControl.Label = 'Dace Type';
    DaceTypeControl.Section = 'left';

    DaceTypeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Random",
                "value": "random"
            },
            {
                "label": "Grid Sampling",
                "value": "grid_sampling"
            },
            {
                "label": "Orthogonal Array",
                "value": "orthogonal_array"
            },
            {
                "label": "Orthogonal Array Latin Hypercube Sampling",
                "value": "orthogonal_array_latin_hypercube_sampling"
            },
            {
                "label": "Latin Hypercube Sampling",
                "value": "latin_hypercube_sampling"
            },
            {
                "label": "Box Behnken",
                "value": "box_behnken"
            },
            {
                "label": "Central Composite",
                "value": "central_composite"
            }
        ];
    };

    DaceTypeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(DaceTypeControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(DaceTypeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = DaceTypeControl;

}).call(this);