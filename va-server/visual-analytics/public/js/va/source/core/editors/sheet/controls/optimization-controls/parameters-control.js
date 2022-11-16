/**
 * Created by sds on 2018-02-12.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'parameters';

    function ParametersControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ParametersControl.prototype = Object.create(_super);
    ParametersControl.prototype.constructor = ParametersControl;

    ParametersControl.Label = 'Parameters';

    ParametersControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ParametersControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;
        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>');
        propPanel.addPropertyControl(ParametersControl.Label, function ($container) {
            $container.append($elements);
            var controlOpt = {
                maxRowCount: 3,
                multiple: true
            };
            _this.controls[CONTROL_KEY] = propPanel.createColumnList($elements, controlOpt);
            _this.controls[CONTROL_KEY].setValue = function (value) {
                this.setSelectedItems(value);
                _this.bindValidation({
                    $target: $elements,
                    control: _this.controls[CONTROL_KEY],
                    label: ParametersControl.Label
                });
            };
            _this.controls[CONTROL_KEY].getValue = function () {
                return this.getSelectedItems();
            };
        }, {mandatory: _this.options.isMandatory});

        propPanel.registerColumnControl(_this.controls[CONTROL_KEY]);
    };

    ParametersControl.prototype.bindValidation = function (ctrlInfo) {
        var _this = this;
        if (typeof ctrlInfo.$target == 'undefined') {
            return;
        }
        if (ctrlInfo.mandatory || this.options.isMandatory) {
            this.checkValidation(ctrlInfo);
            ctrlInfo.control.onChange(function (event) {
                _this.checkValidation(ctrlInfo)
            })
        }
    };


    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ParametersControl;

}).call(this);