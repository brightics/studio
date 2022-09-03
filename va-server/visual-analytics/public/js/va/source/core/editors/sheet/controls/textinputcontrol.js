/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;

    var Brightics = root.Brightics;
    var PropertyControl = Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl;

    TextInputControl.prototype = Object.create(PropertyControl.prototype);

    function TextInputControl(parentId, options) {
        PropertyControl.call(this, parentId, options);
    }

    TextInputControl.prototype.setContents = function ($parents) {
        this.$contentsControl = $('<input type= "text" class="brtc-va-editors-sheet-controls-textinputcontrol" style="margin: 10px;"/>');
        this.$contentsControl.jqxInput({ height: 25, width: "85%", minLength :1, placeHolder: "Enter text"});

        $parents.append(this.$contentsControl);


    };

    root.Brightics.VA.Core.Editors.Sheet.Controls.TextInputControl = TextInputControl;

}).call(this);
