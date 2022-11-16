/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UndoItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);

        this.refresh();
        this.addCommandListener();
        this.addGoHistoryListener();
    }

    UndoItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    UndoItem.prototype.constructor = UndoItem;

    UndoItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.undo,
                    "item-type": "undo"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    UndoItem.prototype.refresh = function () {
        this.refreshEnable();
        this.refreshTitle();
    };

    UndoItem.prototype.refreshEnable = function () {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var commandManager = editor.getCommandManager();

        if (commandManager.canUndo()) {
            this.$mainControl.removeClass('status-disabled');
        } else {
            this.$mainControl.addClass('status-disabled');
        }
    };

    UndoItem.prototype.refreshTitle = function () {
        this.$mainControl.attr('title', Brightics.locale.common.undo);
    };

    UndoItem.prototype.addCommandListener = function () {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        var _this = this;
        editor.addCommandListener(function (command) {
            _this.refresh();
        })
    };

    UndoItem.prototype.addGoHistoryListener = function () {
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        var _this = this;
        editor.addGoHistoryListener(function (command) {
            _this.refresh();
        })
    };

    UndoItem.prototype.handleOnClick = function (event) {
        Studio.getEditorContainer().getActiveModelEditor().getCommandManager().undo();
    };

    Brightics.VA.Core.Editors.Toolbar.UndoItem = UndoItem;

}).call(this);