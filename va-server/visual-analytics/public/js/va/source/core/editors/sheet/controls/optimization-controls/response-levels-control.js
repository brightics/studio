/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'response-levels';

    function ResponseLevelsControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ResponseLevelsControl.prototype = Object.create(_super);
    ResponseLevelsControl.prototype.constructor = ResponseLevelsControl;

    ResponseLevelsControl.Label = 'Response Levels';
    ResponseLevelsControl.Section = 'left';

    ResponseLevelsControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ResponseLevelsControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(ResponseLevelsControl.Label, function ($container) {
            _this.createInputControl($container, {
                maxLength: 1000,
                placeHolder: "ex) '[[0.1,0.2], [0.3,0.4]]"
            });
        }, {
            propertyControlParent: _this.getSection(ResponseLevelsControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ResponseLevelsControl;

}).call(this);