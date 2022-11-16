/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FunctionhelpItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    FunctionhelpItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    FunctionhelpItem.prototype.constructor = FunctionhelpItem;

    FunctionhelpItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.functionReference,
                    "item-type": "functionhelp"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    FunctionhelpItem.prototype.handleOnClick = function (event) {
        //Model마다 type이 다르므로 Implementation에서 override하여 구현
        //var w = window.open('api/va/v2/help/function?type=data', 'Brightics Help');
        //w.blur();
    };

    Brightics.VA.Core.Editors.Toolbar.FunctionhelpItem = FunctionhelpItem;

}).call(this);