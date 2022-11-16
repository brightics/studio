/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;

    var Brightics = root.Brightics;
    var PropertyControl = Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl;

    NumberInputControl.prototype = Object.create(PropertyControl.prototype);

    function NumberInputControl(parentId, options) {
        PropertyControl.call(this, parentId, options);
    }

    NumberInputControl.prototype.setContents = function ($parents) {
        this.$contentsControl = $('<div class="brtc-va-editors-sheet-controls-numberinputcontrol" style="margin: 10px;"/>');
        this.$contentsControl.jqxNumberInput({theme: Brightics.VA.Env.Theme, height: 25, width: "85%"});

        $parents.append(this.$contentsControl);

    };

    root.Brightics.VA.Core.Editors.Sheet.Controls.NumberInputControl = NumberInputControl;

}).call(this);
