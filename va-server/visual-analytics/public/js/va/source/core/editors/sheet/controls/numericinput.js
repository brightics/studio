/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this; //
    var Brightics = root.Brightics;

    function NumericInput(parentId, options) {
        return Brightics.VA.Core.Widget.Factory.numericInputControl(parentId, options);
    }
    Brightics.VA.Core.Editors.Sheet.Controls.NumericInput = NumericInput;

}).call(this);