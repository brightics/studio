/**
 * Created by sds on 2018-02-22.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'constraints-column';

    /**
     * opt script dialog에서 viewer용으로 사용.
     * @param caller
     * @param options
     * @constructor
     */
    function ConstraintsColumnControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ConstraintsColumnControl.prototype = Object.create(_super);
    ConstraintsColumnControl.prototype.constructor = ConstraintsColumnControl;

    ConstraintsColumnControl.Label = 'Constraints';

    ConstraintsColumnControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
    };

    ConstraintsColumnControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;
        var $elements = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>');
        propPanel.addPropertyControl(ConstraintsColumnControl.Label, function ($container) {
            $container.append($elements);
            var controlOpt = {
                disabled: true
            };

            _this.controls[CONTROL_KEY] = _this.createTextAreaControl($elements, controlOpt);
            _this.controls[CONTROL_KEY].setValue = function (value) {
                if(value){
                    $elements.val(value.map(function (elem) {
                        return elem.name
                    }).join('\n'));
                }
            };
            _this.controls[CONTROL_KEY].getValue = function () {
                return $elements.val();
            };
        }, {mandatory: _this.options.isMandatory});
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ConstraintsColumnControl;

}).call(this);