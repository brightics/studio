/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function FunctionhelpItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.FunctionhelpItem.call(this, $parent, options);
    }

    FunctionhelpItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.FunctionhelpItem.prototype);
    FunctionhelpItem.prototype.constructor = FunctionhelpItem;

    FunctionhelpItem.prototype.handleOnClick = function (event) {
        Brightics.VA.Core.Utils.ModelUtils.openFunctionReferencePopup('data');
    };

    Brightics.VA.Implementation.DataFlow.Toolbar.FunctionhelpItem = FunctionhelpItem;

}).call(this);