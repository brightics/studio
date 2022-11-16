/**
 * Created by jhoon80.park on 2016-01-27.
 */
(function () {
    "use strict";

    var root = this;

    var Brightics = root.Brightics;
    var PropertyControl = Brightics.VA.Core.Editors.Sheet.Controls.PropertyControl;

    CheckListControl.prototype = Object.create(PropertyControl.prototype);

    function CheckListControl(parentId, options) {
        PropertyControl.call(this, parentId, options);
    }

    CheckListControl.prototype.setContents = function ($parents) {
        var data = [];
        for (var i = 0; i < this.options.value.length; i++) {
            data[i] = {
                item: this.options.value[i]
            };
        }
        var source =
            {
                localdata: data,
                datafields:
                    [
                        { name: 'item', type: 'string' }
                    ],
                datatype: "array"
            };
        var dataAdapter = new $.jqx.dataAdapter(source);
        this.$contentsControl = $('<div class="brtc-va-editors-sheet-controls-propertycontrol-checklist" style="margin: 10px;"/>');
        this.$contentsControl.jqxGrid({
            theme: Brightics.VA.Env.Theme,
            source: dataAdapter,
            editable: true,
            width: "85%",
            height: "200px",
            rowsheight: 25,
            columns: [
                { text: 'select', editable: true,  columntype: 'checkbox', width: "25%", align: "center"},
                { text: 'item', editable: false, datafield: 'item', width: "75%", align: "center", cellsalign:"center"}
            ]
        });
        $parents.append(this.$contentsControl);

    };

    root.Brightics.VA.Core.Editors.Sheet.Controls.CheckListControl = CheckListControl;

}).call(this);
