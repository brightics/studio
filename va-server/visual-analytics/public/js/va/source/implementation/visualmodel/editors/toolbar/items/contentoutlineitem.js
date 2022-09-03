/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ContentOutlineItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    ContentOutlineItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ContentOutlineItem.prototype.constructor = ContentOutlineItem;

    ContentOutlineItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.contentOutline,
                    "item-type": "content-outline"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ContentOutlineItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        this.$mainControl.toggleClass('status-selected');
        var show = !this.$mainControl.hasClass('status-selected');
        if (show) {
            editor.showContentOutline();
        }
        else {
            editor.hideContentOutline();
        }
    };

    Brightics.VA.Implementation.Visual.Toolbar.ContentOutlineItem = ContentOutlineItem;

}).call(this);