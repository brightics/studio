/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'list';

    function ListControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ListControl.prototype = Object.create(_super);
    ListControl.prototype.constructor = ListControl;

    ListControl.Label = 'List';
    ListControl.Section = 'left';

    ListControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ListControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(ListControl.Label, function ($container) {
            _this.createInputControl($container, {
                maxLength: 1000,
                placeHolder: "ex) {'x1':[0.4, 0.5, 1.2, 3], 'x2':[6, 7, 8, 9]}"
            });
        }, {
            propertyControlParent: _this.getSection(ListControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ListControl;

}).call(this);