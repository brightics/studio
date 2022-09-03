/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;

    var Brightics = root.Brightics;
    var PropertyControl = Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl;

    GridControl.prototype = Object.create(PropertyControl.prototype);

    function GridControl(parentId, options) {
        PropertyControl.call(this, parentId, options);
    }

    GridControl.prototype.setContents = function ($parents) {
        var columns = [];
        var columnsLength = this.options.value.length;
        var columnswidth = 100/columnsLength + "%";
        for (var i = 0; i < columnsLength; i++) {
            columns[i] = {text: this.options.value[i] , width: columnswidth, align: "center", cellsalign:"center"};
        }
        this.$contentsControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-grid" style="margin: 10px;"/>');
        this.$contentsControl.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            width: "85%",
            height: "200px",
            rowsheight: 25,
            editable: true,
            columns: columns
        });
        this.$contentsControl.jqxGrid('addrow', null, {});

        $parents.append(this.$contentsControl);

    };

    root.Brightics.VA.Core.Editors.Sheet.Controls.GridControl = GridControl;

}).call(this);
