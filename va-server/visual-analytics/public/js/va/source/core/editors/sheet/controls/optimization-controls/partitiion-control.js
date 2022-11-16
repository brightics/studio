/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'partition';

    function PartitionControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    PartitionControl.prototype = Object.create(_super);
    PartitionControl.prototype.constructor = PartitionControl;

    PartitionControl.Label = 'Partition';
    PartitionControl.Section = 'left';

    PartitionControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    PartitionControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(PartitionControl.Label, function ($container) {
            _this.createNumberArrayControl($container, {
                placeHolder: 'ex) 5,5',
                value: _this.options.value
            });
        }, {
            propertyControlParent: _this.getSection(PartitionControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = PartitionControl;

}).call(this);
