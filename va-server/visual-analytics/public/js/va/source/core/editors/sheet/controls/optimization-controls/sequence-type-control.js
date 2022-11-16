/**
 * Created by sds on 2018-02-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'sequence-type';

    function SequenceTypeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    SequenceTypeControl.prototype = Object.create(_super);
    SequenceTypeControl.prototype.constructor = SequenceTypeControl;

    SequenceTypeControl.Label = 'Sequence Type';
    SequenceTypeControl.Section = 'left';

    SequenceTypeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Halton",
                "value": "halton"
            },
            {
                "label": "Hammersley",
                "value": "hammersley"
            }
        ];

        this.controls[CONTROL_KEY] = {}
    };

    SequenceTypeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(SequenceTypeControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(SequenceTypeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = SequenceTypeControl;

}).call(this);