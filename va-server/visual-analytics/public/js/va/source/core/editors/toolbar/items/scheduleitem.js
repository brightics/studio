/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ScheduleItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    ScheduleItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ScheduleItem.prototype.constructor = ScheduleItem;

    ScheduleItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": "Schedule",
                    "item-type": "schedule"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ScheduleItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        new Brightics.VA.Core.Dialogs.ScheduleManagementDialog(editor.$mainControl, {
            editorInput: editor.options.editorInput,
            appendTo: editor.$parent,
            position: {my: 'center top', at: 'center top+15%', of: window},
            title: 'Schedule list'
        });
    };

    Brightics.VA.Core.Editors.Toolbar.ScheduleItem = ScheduleItem;

}).call(this);