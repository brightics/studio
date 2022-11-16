/**
 * Created by sds on 2018-02-23.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;

    const CONTROL_KEY = 'list-type';

    function ListTypeControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    ListTypeControl.prototype = Object.create(_super);
    ListTypeControl.prototype.constructor = ListTypeControl;

    ListTypeControl.Label = 'List Type';
    ListTypeControl.Section = 'left';

    ListTypeControl.prototype.init = function () {
        _super.init.call(this);
        this.CONTROL_KEY = CONTROL_KEY;
        this.Source = [
            {
                "label": "Val List",
                "value": "val_list"
            },
            // OPT쪽에서 테스트 완료후 적용요청하면 적용할것 
            // {
            //     "label": "Val File",
            //     "value": "val_file"
            // }
        ];

        this.controls[CONTROL_KEY] = {}
    };

    ListTypeControl.prototype.createControl = function () {
        var _this = this;
        var propPanel = this.caller;

        propPanel.addPropertyControl(ListTypeControl.Label, function ($container) {
            _this.createDropDownControl($container, {
                source: _this.options.source || _this.Source
            });
        }, {
            propertyControlParent: _this.getSection(ListTypeControl.Section),
            mandatory: _this.options.isMandatory
        });
    };

    Brightics.VA.Core.Editors.Sheet.Controls.Optimization[CONTROL_KEY] = ListTypeControl;

}).call(this);