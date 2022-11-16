/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function TooltipItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    TooltipItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    TooltipItem.prototype.TooltipItem = TooltipItem;

    TooltipItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.tooltip,
                    "item-type": "tooltip"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    TooltipItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        var isSelected = this.$mainControl.hasClass('status-selected');
        if (isSelected) {
            editor.diagramEditorPage.changeTooltipEnabled(false);
            this.$mainControl.removeClass('status-selected');
        } else {
            editor.diagramEditorPage.changeTooltipEnabled(true);
            this.$mainControl.addClass('status-selected');
        }
    };

    Brightics.VA.Core.Editors.Toolbar.TooltipItem = TooltipItem;

}).call(this);