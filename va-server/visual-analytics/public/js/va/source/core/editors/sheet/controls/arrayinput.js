/**
 * Created by ng1123.kim on 2016-03-23.
 */
(function () {
    'use strict';

    var root = this; //
    var Brightics = root.Brightics;

    function ArrayInput(parentId, options) {
        return Brightics.VA.Core.Widget.Factory.arrayInputControl(parentId, options);
    }
    Brightics.VA.Core.Editors.Sheet.Controls.ArrayInput = ArrayInput;

}).call(this);