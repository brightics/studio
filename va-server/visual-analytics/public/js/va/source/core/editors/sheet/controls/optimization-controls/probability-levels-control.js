/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'probability-levels';

    function ProbabilityLevelsControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ProbabilityLevelsControl.prototype = Object.create(_super);
    ProbabilityLevelsControl.prototype.constructor = ProbabilityLevelsControl;

    ProbabilityLevelsControl.Label = 'Probability Levels';
    ProbabilityLevelsControl.Section = 'left';

    ProbabilityLevelsControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ProbabilityLevelsControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(ProbabilityLevelsControl.Label, function ($container) {
            _this.createInputControl($container, {
                maxLength: 1000,
                placeHolder: "ex) '[[0.1,0.2], [0.3,0.4]]"
            });
        }, {
            propertyControlParent: _this.getSection(ProbabilityLevelsControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ProbabilityLevelsControl;

}).call(this);